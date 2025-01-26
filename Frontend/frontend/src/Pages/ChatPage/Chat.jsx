import React, { useEffect, useState } from "react";
import ChatInput from "./MessageSend";
import { io } from 'socket.io-client';

const fetchMessages = async (roomId) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/getMessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId }),
    });
    if (response.ok) {
        return await response.json();
    }
    else {
        console.log("Error while fetching messages");
        return [];
    }
};

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

const findCurrentUserMessage = (message, user) => {
    return message.user.userId === user.userId;
};

const socket = io('http://localhost:3000');  // Your Node.js WebSocket server

const Chat = ({ room }) => {
    const [messages, setMessages] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null); // To track dropdown states
    const [user, setUser] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        fetchMessages(room.roomId).then((data) => {
            setMessages(data);
        });
        fetchUser().then((data) => {
            console.log(data);
            setUser(data);
        });

        // Join room
        socket.emit('join_room', room.roomId);
        // Listen for incoming messages
        socket.on('message_broadcast', (broadcastedMessage) => {
            console.log("Received message:", broadcastedMessage);
            setMessages((prevMessages) => [...prevMessages, broadcastedMessage]);
        });
        socket.on('error', (errorMessage) => {
            console.error(errorMessage);
        });
        return () => {
            socket.off('message_broadcast');
            socket.off('error');
        };

    }, [room]);

    const toggleDropdown = (messageId) => {
        setDropdownOpen((prev) => (prev === messageId ? null : messageId));
    };

    const handleTagMessage = (messageId) => {
        console.log("Tagging message with ID:", messageId);
        setDropdownOpen(null); // Close dropdown
    };

    return (
        <div className="chat-container" style={{ display: "flex", flexDirection: "column", height: "100vh", maxHeight: "100vh" }}>
            <div
                className="chat-content"
                id="chat-content"
                style={{ flex: 1, overflowY: "auto", padding: "16px", backgroundColor: "#1e1e1e", color: "#e0e0e0", maxHeight: "calc(100vh - 40vh)" }}
            >
                {messages.map((messageDTO) => {
                    const { message, pollOptions } = messageDTO;
                    const isSent = findCurrentUserMessage(message, user); //Logic to show one in right and one in left
                    return (
                        <div
                            key={message.messageId}
                            className="message"
                            style={{
                                display: "flex",
                                justifyContent: isSent ? "flex-end" : "flex-start",
                                marginBottom: "16px",
                            }}
                        >
                            <div
                                className="message-bubble"
                                style={{
                                    padding: "12px",
                                    borderRadius: "16px",
                                    maxWidth: "300px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: isSent ? "#333" : "#333",
                                    color: isSent ? "#fff" : "#000",
                                }}
                            >
                                {!message.isAnonymous && (
                                    <p
                                        style={{
                                            fontWeight: "lighter",
                                            fontSize: "12px", // Smaller font size
                                            color: "#b0b0b0", // Light grey color
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {message.user.name}
                                    </p>
                                )}

                                {message.isPoll ? (
                                    <div>
                                        <p style={{ fontWeight: "bold" }}>Poll:</p>
                                        {pollOptions.map((option) => (
                                            <div key={option.optId} className="poll-option">
                                                <input
                                                    type="radio"
                                                    id={`option-${option.optId}`}
                                                    name={`poll-${message.messageId}`}
                                                />
                                                <label htmlFor={`option-${option.optId}`} style={{ marginLeft: "8px" }}>
                                                    {option.optText}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>{message.text}</p>
                                )}
                                <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "8px" }}>
                                    {new Date(message.postTime).toLocaleTimeString()}
                                </div>
                                <div style={{ position: "relative", marginTop: "8px" }}>
                                    <button
                                        onClick={() => toggleDropdown(message.messageId)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#000",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                        }}
                                    >
                                        ⋮
                                    </button>
                                    {dropdownOpen === message.messageId && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                right: "0",
                                                background: "#333",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                                zIndex: 1000,
                                            }}
                                        >
                                            <button
                                                onClick={() => handleTagMessage(message.messageId)}
                                                style={{
                                                    display: "block",
                                                    padding: "8px 16px",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Like
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput room={room} />
        </div>
    );
};

export default Chat;
