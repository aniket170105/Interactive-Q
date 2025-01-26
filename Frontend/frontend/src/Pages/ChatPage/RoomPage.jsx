import React, { useEffect, useState } from "react";
import RoomOptions from "./RoomOptions";
import Chat from "./Chat";

const RoomPage = ({ room }) => {
    const [roomDetails, setRoomDetails] = useState(null);

    useEffect(() => {
    }, [room]);

    if (!room) {
        return <p>Select a room to view details.</p>;
    }
    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>{room.roomName}</h2>
                <div className="options-menu">
                    <span className="eye-icon">
                        <RoomOptions room={room}/>
                    </span>
                </div>
            </div>
            <Chat/>
        </div>
    );
};

export default RoomPage;
