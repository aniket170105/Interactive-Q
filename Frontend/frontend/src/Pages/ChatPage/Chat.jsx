import React, { useEffect, useState } from "react";
import ChatInput from "./MessageSend";

const mockData = [
    {
        message: {
            messageId: 1,
            isAnonymous: false,
            isPoll: false,
            text: "Hi, how are you?",
            isDeleted: false,
            postTime: "2025-01-25T10:00:00Z",
            user: { userId: 1, name: "Alice", isCurrentUser: false },
        },
        pollOptions: [],
    },
    {
        message: {
            messageId: 2,
            isAnonymous: true,
            isPoll: false,
            text: "I'm doing great! How about you?",
            isDeleted: false,
            postTime: "2025-01-25T10:05:00Z",
            user: { userId: 2, name: "Bob", isCurrentUser: true },
        },
        pollOptions: [],
    },
    {
        message: {
            messageId: 3,
            isAnonymous: false,
            isPoll: true,
            text: "What's your favorite programming language?",
            isDeleted: false,
            postTime: "2025-01-25T10:10:00Z",
            user: { userId: 1, name: "Alice", isCurrentUser: false },
        },
        pollOptions: [
            { optId: 1, optText: "JavaScript" },
            { optId: 2, optText: "Python" },
            { optId: 3, optText: "Java" },
            { optId: 4, optText: "C++" },
        ],
    },
    {
        message: {
            messageId: 4,
            isAnonymous: false,
            isPoll: false,
            text: "Hi, how are you?",
            isDeleted: false,
            postTime: "2025-01-25T10:00:00Z",
            user: { userId: 1, name: "Alice", isCurrentUser: false },
        },
        pollOptions: [],
    }
];

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null); // To track dropdown states

    // Mock API call to fetch messages
    useEffect(() => {
        setMessages(mockData);
    }, []);

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
                    const isSent = message.user?.isCurrentUser; // Replace with your user logic
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
                                                Tag Message
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput/>
        </div>
    );
};

export default Chat;
