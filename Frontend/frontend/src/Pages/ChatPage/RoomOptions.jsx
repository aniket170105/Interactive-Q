import React, { useState, useEffect } from "react";
import MemberSidebar from "./MemberSidebar";
import { use } from "react";

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
        console.log("Error Encoutered while creating Room");
        return [];
    }
};
const removeUser = async (userId, roomId, socket, setIsToBeRefreshed) => {
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
        console.log("Error while removing user");
        alert(await response.text());
    }
};
const acceptUser = async (userId, roomId, socket, setIsToBeRefreshed) => {
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
        console.log("Error while accepting user");
        alert("You are not authorized to perform this action");
    }
};
const renameGroup = async (roomId, newGroupName, socket, setIsToBeRefreshed) => {
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
        console.log("Error while renaming group");
        alert("You are not authorized to perform this action");
    }
};

// Only leave group (SOCKET) is not handled every other action is handled
const leaveGroup = async (roomId, socket, setIsToBeRefreshed) => {
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
        console.log("Error while leaving group");
        alert(await response.text());
    }
};
const endGroup = async (roomId, socket, setIsToBeRefreshed) => {
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
        console.log("Error while ending group");
        alert(await response.text());
    }
};

const RoomOptions = ({room, isNewGroupCreatedOrJoined, setIsNewGroupCreatedOrJoined, socket, setIsToBeRefreshed}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [members, setMembers] = useState([]);
    const [refreshMemebers, setRefreshMembers] = useState(false);
    const [isRenameGroup, setIsRenameGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    const memberRemoveAddRejectAction = async (action, userId) => {
        if(action === "accept"){
            console.log(room);
            acceptUser(userId, room.roomId, socket, setIsToBeRefreshed);
            setRefreshMembers(!refreshMemebers);
        }
        else if(action === "reject"){
            removeUser(userId, room.roomId, socket, setIsToBeRefreshed);
            setRefreshMembers(!refreshMemebers);
        }
        else if(action === "remove"){
            removeUser(userId, room.roomId, socket, setIsToBeRefreshed);
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
        <div style={{ position: "relative" }}>
            {/* Image */}
            <img
                src="src/assets/three-dots-vertical-svgrepo-com.svg"
                alt="Details"
                id="view-members"
                onClick={() => setShowOptions((prev) => !prev)}
                style={{ cursor: "pointer" }}
            />

            {/* Dropdown Menu */}
            {showOptions && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        backgroundColor: "#252525",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        zIndex: 10,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <button
                        onClick={() => {leaveGroup(room.roomId, socket, setIsToBeRefreshed); setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);}}
                        style={menuButtonStyle}
                    >
                        Leave Group
                    </button>
                    <button
                        onClick={() => {setIsRenameGroup(true);
                        }}
                        style={menuButtonStyle}
                    >
                        Rename Group
                    </button>
                    <button
                        onClick={() => handleOptionClick("members")}
                        style={menuButtonStyle}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => {endGroup(room.roomId, socket, setIsToBeRefreshed); setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);}}
                        style={menuButtonStyle}
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
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Rename Group</h2>
                        <input
                            type="text"
                            placeholder="Enter new group name"
                            value={newGroupName}
                            onChange={(e) => {setNewGroupName(e.target.value);
                            }}
                            required
                        />
                        <div className="modal-buttons">
                            <button onClick={()=>{
                                console.log("Rename Group");
                                renameGroup(room.roomId, newGroupName, socket, setIsToBeRefreshed);
                                setIsRenameGroup(false);
                                setTimeout(() => {
                                    setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);
                                }, 500);
                            }}>Submit</button>
                            <button onClick={()=>{setIsRenameGroup(false)}}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Style for dropdown buttons
const menuButtonStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#252525",
    color: "#ccc",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
};

export default RoomOptions;
