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

    //   if (!room) {
    //     return <p>Loading room details...</p>;
    //   }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h2>{room.roomName}</h2>
                <div className="options-menu">
                    <span className="eye-icon">
                        {/* <img
              src="src/assets/three-dots-vertical-svgrepo-com.svg"
              alt="Details"
              id="view-members"
            /> */}
                        <RoomOptions/>
                    </span>
                    {/* <div className="dropdown-content">
                        <button>Exit Group</button>
                    </div> */}
                </div>
            </div>
            {/* <div className="chat-content" id="chat-content">
                <p>{room.isEnded ? "This room has ended." : "Room is active."}</p>
                
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Enter a message..." />
            </div> */}
            <Chat/>
        </div>
    );
};

export default RoomPage;
