import React, { useState, useEffect } from "react";
import MemberSidebar from "./MemberSidebar";
import { useToast } from '../../components/ToastProvider.jsx'

const onOptionSelect = (option, setShowMembers) => {
    if(option === "members"){
        setShowMembers(true);
    }
    else if(option === "leave"){
        console.log("Leave Group");
    }
    else if(option === "rename"){
        console.log("Rename Group");
    }
    else if(option === "end"){
        console.log("End Group");
    }
};
const fetchMemebers = async (room) => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log(room.roomId);
    const response = await fetch('http://localhost:8081/user/room/allUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": room.roomId }),
    });
    if (response.ok) {
        return await response.json();
    }
    else {
        return [];
    }
};
const removeUser = async (userId, roomId, socket, setIsToBeRefreshed, notify) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/removeUser', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId, "userId": userId }),
    });
    if(response.ok){
        console.log("User Removed");
        socket.emit("rejectUser", {"roomId": roomId, "userId": userId});
        setIsToBeRefreshed((prev) => !prev);
    }
    else{
        notify(await response.text(), { type: 'error' });
    }
};
const acceptUser = async (userId, roomId, socket, setIsToBeRefreshed, notify) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/authenticateUser', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId, "userId": userId }),
    });
    if(response.ok){
        console.log("User Accepted");
        socket.emit("acceptUser", {"roomId": roomId, "userId": userId});
        setIsToBeRefreshed((prev) => !prev);
    }
    else{
        notify("You are not authorized to perform this action", { type: 'error' });
    }
};
const renameGroup = async (roomId, newGroupName, socket, setIsToBeRefreshed, notify) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/rename', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId, "newName": newGroupName }),
    });
    if(response.ok){
        console.log("Group Renamed");
        socket.emit("renameGroup", {"roomId": roomId});
        setIsToBeRefreshed((prev) => !prev);
    }
    else{
        notify("You are not authorized to perform this action", { type: 'error' });
    }
};

// Only leave group (SOCKET) is not handled every other action is handled
const leaveGroup = async (roomId, socket, setIsToBeRefreshed, notify) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/leaveRoom', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId}),
    });
    if(response.ok){
        console.log("Group Left");
        setIsToBeRefreshed((prev) => !prev);
    }
    else{
        notify(await response.text(), { type: 'error' });
    }
};
const endGroup = async (roomId, socket, setIsToBeRefreshed, notify) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/deleteRoom', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId}),
    });
    if(response.ok){
        console.log("Group Ended");
        socket.emit("endGroup", {"roomId": roomId});
        setIsToBeRefreshed((prev) => !prev);
    }
    else{
        notify(await response.text(), { type: 'error' });
    }
};

const RoomOptions = ({room, isNewGroupCreatedOrJoined, setIsNewGroupCreatedOrJoined, socket, setIsToBeRefreshed}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [members, setMembers] = useState([]);
    const [refreshMemebers, setRefreshMembers] = useState(false);
    const [isRenameGroup, setIsRenameGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const { notify } = useToast();

    const memberRemoveAddRejectAction = async (action, userId) => {
        if(action === "accept"){
            console.log(room);
            acceptUser(userId, room.roomId, socket, setIsToBeRefreshed, notify);
            setRefreshMembers(!refreshMemebers);
        }
        else if(action === "reject"){
            removeUser(userId, room.roomId, socket, setIsToBeRefreshed, notify);
            setRefreshMembers(!refreshMemebers);
        }
        else if(action === "remove"){
            removeUser(userId, room.roomId, socket, setIsToBeRefreshed, notify);
            setRefreshMembers(!refreshMemebers);
        }
    };

    useEffect(() => {
        if(showMembers){
            setTimeout(() => {
                fetchMemebers(room).then((data) => {
                    console.log(data);
                    setMembers(data);
                });
            }, 500);
                // fetchMemebers(room).then((data) => {
                //     console.log(data);
                //     setMembers(data);
                // });
        }
    }, [showMembers, refreshMemebers]);
    
    useEffect(() => {
        setShowMembers(false);
        setIsRenameGroup(false);
        setShowOptions(false);
        setMembers([]);
        setNewGroupName("");
    }, [room]);

    const handleOptionClick = (option) => {
        setShowOptions(false); // Close dropdown
        onOptionSelect(option, setShowMembers); // Pass selected option
    };


    return (
    <div className="relative z-50">
            <img
                src="src/assets/three-dots-vertical-svgrepo-com.svg"
                alt="Details"
                id="view-members"
                onClick={() => setShowOptions((prev) => !prev)}
                className="cursor-pointer w-5 h-5 opacity-80 hover:opacity-100"
            />

            {showOptions && (
                <div className="absolute top-full right-0 mt-1 bg-white/95 dark:bg-neutral-700/90 backdrop-blur text-neutral-900 dark:text-neutral-100 rounded-md shadow-lg z-[60] overflow-hidden border border-neutral-200/60 dark:border-neutral-700/50">
                    <button
                        onClick={() => {leaveGroup(room.roomId, socket, setIsToBeRefreshed, notify); setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);}}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                        Leave Group
                    </button>
                    <button
                        onClick={() => {setIsRenameGroup(true);}}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                        Rename Group
                    </button>
                    <button
                        onClick={() => handleOptionClick("members")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                        Members
                    </button>
                    <button
                        onClick={() => {endGroup(room.roomId, socket, setIsToBeRefreshed, notify); setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);}}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:text-red-300 dark:hover:bg-neutral-700"
                    >
                        End Group
                    </button>
                </div>
            )}
            {showMembers && (
                <MemberSidebar
                    members={members}
                    onClose={()=>{setShowMembers(false)}}
                    handleMemberAction={(action, userId)=>{
                        memberRemoveAddRejectAction(action, userId);
                    }}
                />
            )}
            {isRenameGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="card p-5 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-3">Rename Group</h2>
                        <input
                            type="text"
                            placeholder="Enter new group name"
                            value={newGroupName}
                            onChange={(e) => {setNewGroupName(e.target.value);}}
                            required
                            className="input"
                        />
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button className="btn-outline" onClick={()=>{setIsRenameGroup(false)}}>Cancel</button>
                            <button className="btn" onClick={()=>{
                                console.log("Rename Group");
                                renameGroup(room.roomId, newGroupName, socket, setIsToBeRefreshed, notify);
                                setIsRenameGroup(false);
                                setTimeout(() => {
                                    setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);
                                }, 500);
                            }}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomOptions;
