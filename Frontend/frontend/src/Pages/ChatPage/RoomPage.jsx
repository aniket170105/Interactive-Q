import React, { useEffect, useState } from "react";
import RoomOptions from "./RoomOptions";
import Chat from "./Chat";

const RoomPage = ({ room, isNewGroupCreatedOrJoined, setIsNewGroupCreatedOrJoined}) => {
    const [roomDetails, setRoomDetails] = useState(null);

    useEffect(() => {
    }, []);
    if (!room) {
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: '100%', height: '100%'}}>Select a room to view details.</div>;
    }
    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>{room.roomName}</h2>
                <div className="options-menu">
                    <span className="eye-icon">
                        <RoomOptions room={room} isNewGroupCreatedOrJoined={isNewGroupCreatedOrJoined} setIsNewGroupCreatedOrJoined={setIsNewGroupCreatedOrJoined}/>
                    </span>
                </div>
            </div>
            <Chat room={room}/>
        </div>
    );
};

export default RoomPage;
