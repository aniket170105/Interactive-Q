import React, { useState } from "react";
import MemberSidebar from "./MemberSidebar";

const onOptionSelect = (option, setShowMembers) => {
    if(option === "members"){
        setShowMembers(true);
    }
};

const RoomOptions = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const handleOptionClick = (option) => {
        setShowOptions(false); // Close dropdown
        onOptionSelect(option, setShowMembers); // Pass selected option
    };

    const members = [
        {
            person: { userId: 1, name: "Alice Johnson" },
            isAuthenticated: true,
            isExited: false,
        },
        {
            person: { userId: 2, name: "Bob Smith" },
            isAuthenticated: false,
            isExited: false,
        },
        {
            person: { userId: 3, name: "Charlie Brown" },
            isAuthenticated: true,
            isExited: false,
        },
        {
            person: { userId: 4, name: "Daisy Ridley" },
            isAuthenticated: false,
            isExited: true,
        },
        {
            person: { userId: 5, name: "Ethan Hunt" },
            isAuthenticated: true,
            isExited: false,
        },
    ];

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
                        backgroundColor: "black",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        zIndex: 10,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <button
                        onClick={() => handleOptionClick("leave")}
                        style={menuButtonStyle}
                    >
                        Leave Group
                    </button>
                    <button
                        onClick={() => handleOptionClick("rename")}
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
                        onClick={() => handleOptionClick("end")}
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
                    handleMemberAction={(e)=>{}}
                />
            )}
        </div>
    );
};

// Style for dropdown buttons
const menuButtonStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "white",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
};

const memberButtonStyle = {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "12px",
    cursor: "pointer",
};

const closeButtonStyle = {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
};

export default RoomOptions;
