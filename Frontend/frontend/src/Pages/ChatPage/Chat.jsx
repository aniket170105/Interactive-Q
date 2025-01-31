import React, { useEffect, useState } from "react";
import ChatInput from "./MessageSend";
import { io } from 'socket.io-client';
import PollComponent from "./PollComponent";
import { use } from "react";


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

const isUserAuthorizedInRoom = async (roomId) => {
    console.log(roomId);
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/isUserAuthorized', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId }),
    });
    if (response.ok) {
        return true;
    }
    else {
        console.log("User not authorized in room");
        return false;
    }
};

const findCurrentUserMessage = (message, user) => {
    return message.user.userId === user.userId;
};

const voteAPI = async (optionId, socket) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/poll/vote', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "optId": optionId }),
    });

    if (response.ok) {
        console.log("Voted successfully!");
        socket.emit('vote', await response.json());
    }
    else {
        console.log("Error while voting");
    }
};

const likeMessageAPI = async (messageId, socket) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/message/like', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "messageId": messageId }),
    });

    if (response.ok) {
        const likeData = await response.json();
        socket.emit('like', likeData); // Emit the like event
    } else {
        console.log("Error while liking the message");
    }
};

const unlikeMessageAPI = async (messageId, socket) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/room/message/unlike', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "messageId": messageId }),
    });

    if (response.ok) {
        const unlikeData = await response.json();
        socket.emit('unlike', unlikeData); // Emit the unlike event
    } else {
        console.log("Error while unliking the message");
    }
};

const Chat = ({ room}) => {
    const [messages, setMessages] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null); // To track dropdown states
    const [user, setUser] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const socket = io("http://localhost:3000");
        setClient(socket);
        setMessages([]);
        fetchMessages(room.roomId).then((data) => {
            console.log(data);
            setMessages(data);
        });

        isUserAuthorizedInRoom(room.roomId).then((data) => {
            console.log(data);
            if (data === true) {
                socket.emit("joinRoom", room.roomId);
                const messageListener = ({ user, message }) => {
                    if (message.message.room.roomId === room.roomId) {
                        setMessages((prevMessages) => [...prevMessages, message]);
                    }
                };
                socket.on("message", messageListener);

                // To receive brodcasted poll
                socket.on("vote", (voteData) => {
                    console.log("Vote data broadcasted");
                    setMessages((prevMessages) => {
                        return prevMessages.map((msg) => {
                            if (msg.message.messageId === voteData.option.message.messageId) {
                                return {
                                    ...msg,
                                    pollOptions: msg.pollOptions.map((opt) => {
                                        if (opt.optId === voteData.option.optId) {
                                            return {
                                                ...opt,
                                                userVoted: [...opt.userVoted, voteData.person],
                                            };
                                        }
                                        return opt;
                                    }),
                                };
                            }
                            return msg;
                        });
                    });
                });

                const likeListener = (likeData) => {
                    setMessages((prevMessages) => {
                        return prevMessages.map((msg) => {
                            if (msg.message.messageId === likeData.message.messageId) {
                                return {
                                    ...msg,
                                    userLiked: [...msg.userLiked, likeData.person],
                                };
                            }
                            return msg;
                        });
                    });
                };
                socket.on("like", likeListener);

                const unlikeListener = (unlikeData) => {
                    setMessages((prevMessages) => {
                        return prevMessages.map((msg) => {
                            if (msg.message.messageId === unlikeData.message.messageId) {
                                return {
                                    ...msg,
                                    userLiked: msg.userLiked.filter(user => user.userId !== unlikeData.person.userId),
                                };
                            }
                            return msg;
                        });
                    });
                };
                socket.on("unlike", unlikeListener);
                // Cleanup function to remove the event listener
                return () => {
                    socket.off("message", messageListener);
                    socket.off("vote");
                    socket.off("like", likeListener);
                    socket.off("unlike", unlikeListener);
                    socket.emit("leaveRoom", room.roomId);
                };
            }
        });
        
    }, [room]);

    useEffect(() => {
        fetchUser().then((data) => {
            console.log(data);
            setUser(data);
        });
    }, []);

    const toggleDropdown = (messageId) => {
        setDropdownOpen((prev) => (prev === messageId ? null : messageId));
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

                                {message.isPoll ?
                                    (<PollComponent message={message} pollOptions={pollOptions} voteAPI={voteAPI} currentUser={user} socket={client}/>)
                                    : (<p>{message.text}</p>)
                                    // message.isPoll ? (
                                    //     <div>
                                    //         <p style={{ fontWeight: "bold" }}>{message.text}</p>
                                    //         {pollOptions.map((option) => (
                                    //             <div key={option.optId} className="poll-option">
                                    //                 <input
                                    //                     type="radio"
                                    //                     id={`option-${option.optId}`}
                                    //                     name={`poll-${message.messageId}`}
                                    //                 />
                                    //                 <label htmlFor={`option-${option.optId}`} style={{ marginLeft: "8px" }}>
                                    //                     {option.optText}
                                    //                 </label>
                                    //                 <span style={{ marginLeft: "8px" }}>
                                    //                     ({option.userVoted.length} votes)
                                    //                 </span>
                                    //             </div>
                                    //         ))}
                                    //     </div>
                                    // ) : (
                                    //     <p>{message.text}</p>
                                    // )
                                }
                                <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "8px" }}>
                                    {new Date(message.postTime).toLocaleTimeString()}
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                    <span style={{ fontSize: "12px", color: "#b0b0b0" }}>
                                        {messageDTO.userLiked ? messageDTO.userLiked.length : 0} likes
                                    </span>
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
                                                {messageDTO.userLiked.some(msgUser => msgUser.userId === user.userId) ? (
                                                    <button
                                                        onClick={() => {
                                                            unlikeMessageAPI(message.messageId, client);
                                                            setDropdownOpen(null);
                                                        }}
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
                                                        Unlike
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            likeMessageAPI(message.messageId, client);
                                                            setDropdownOpen(null);
                                                        }}
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
                                                )}
                                                {/* <button
                                                onClick={() => handleLikeMessage(message.messageId)}
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
                                            </button> */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput room={room} socket={client} />
        </div>
    );
};

export default Chat;
