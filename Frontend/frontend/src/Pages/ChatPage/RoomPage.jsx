import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import RoomOptions from "./RoomOptions";
import Chat from "./Chat";

const fetchUser = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/Profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
    });
    if (response.ok) {
        return await response.json();
    }
    else {
        console.log("Error while fetching user");
        return null;
    }
};

const RoomPage = ({ room, isNewGroupCreatedOrJoined, setIsNewGroupCreatedOrJoined, isToBeRefreshed, setIsToBeRefreshed }) => {
    const [roomDetails, setRoomDetails] = useState(null);
    const [client, setClient] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUser().then((data) => {
            setCurrentUser(data);
        });
    }, []);


    useEffect(() => {
        setRoomDetails(room);
        if (room) {
            const socket = io("http://localhost:3000");
            socket.emit("joinRoom", room.roomId);
            setClient(socket);

            socket.on("rejectUser", (data) => {
                if (data.userId == currentUser.userId) {
                    setIsToBeRefreshed((pre) => !pre);
                }
            });

            socket.on("acceptUser", (data) => {
                if (data.userId == currentUser.userId) {
                    setIsToBeRefreshed((pre) => !pre);
                }
            });

            socket.on("renameGroup", (data) => {
                setIsToBeRefreshed((pre) => !pre);
            });

            socket.on("endGroup", (data) => {
                setIsToBeRefreshed((pre) => !pre);
            });

            return () => {
                socket.emit("leaveRoom", room.roomId);
            };
        }
    }, [room]);

    useEffect(() => {
        setRoomDetails(null);
        console.log("I am in RoomPage.jsx and logically i should be called");
    }, [isToBeRefreshed]);

    if (!roomDetails) {
        return (
            <div className="flex-1 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center">
                <div className="text-neutral-600 dark:text-neutral-400">Select a room to view details.</div>
            </div>
        )
        // return <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: '100%', height: '100%'}}>Select a room to view details.</div>;
    }
    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60">
                <h2 className="font-semibold">{room.roomName}</h2>
                <div>
                    <RoomOptions room={roomDetails} isNewGroupCreatedOrJoined={isNewGroupCreatedOrJoined} setIsNewGroupCreatedOrJoined={setIsNewGroupCreatedOrJoined}
                        socket={client} setIsToBeRefreshed={setIsToBeRefreshed} />
                </div>
            </div>
            <Chat room={roomDetails} />
        </div>
    );
};

export default RoomPage;
