import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./styles.css";
import RoomPage from './RoomPage';

const refreshTokens = async () => {
    const token = localStorage.getItem('sessionToken');
    const response = await fetch('http://localhost:8081/auth/v1/refreshToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "token": token }),
    });

    if (response.ok) {
        const { refreshToken, sessionToken } = await response.json();
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("sessionToken", sessionToken);
        return true;
    }
    else {
        console.log("Error Refreshing Token");
        return false;
    }
};

const fetchRooms = async (setRoom, setFilteredRooms) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/allRoom', {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${refreshToken}`
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        // return data;
        setRoom(data);
        setFilteredRooms(data);
    }
    else {
        console.log("Error while fetching the Rooms");
        // return [];
    }
};

const joinGroupAPI = async (roomName) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/createRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomName": roomName }),
    });

    if (response.ok) {
        console.log("Room created succesfully");
    }
    else {
        console.log("Error Encoutered while creating Room");
    }
};

const joinNewGroupAPI = async (roomId) => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8081/user/joinRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ "roomId": roomId }),
    });

    if (response.ok) {
        console.log("Room Joined succesfully");
    }
    else {
        console.log("Error Encoutered while creating Room");
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

const chatPage = () => {
    const [isNewChat, setIsNewChat] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [isJoinGroup, setIsJoinGroup] = useState(false);
    const [joinGroupName, setJoinGroupName] = useState("");
    const [rooms, setRoom] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isToBeRefreshed, setIsToBeRefreshed] = useState(false);
    const [isNewGroupCreatedOrJoined, setIsNewGroupCreatedOrJoined] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        document.title = "InteractiveQ - Chat";
        refreshTokens().then((state) => {
            if (state === false) {
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('sessionToken');
                navigate('/signin');
            }
        });
        fetchUser().then((data) => {
            setCurrentUser(data);
        });
    }, []);

    useEffect(() => {
        console.log("ChatPage mounted");

        setTimeout(() => {
            fetchRooms(setRoom, setFilteredRooms);
        }, 500);
        // fetchRooms(setRoom, setFilteredRooms);

        console.log(rooms.length);
    }, [isNewGroupCreatedOrJoined]);

    useEffect(() => {
        fetchRooms(setRoom, setFilteredRooms);
    }, [isToBeRefreshed]);

    const handleSearchChange = (e) => {
        const input = e.target.value.toLowerCase();
        setSearchText(input);
        const filtered = rooms.filter((room) =>
            room.roomName.toLowerCase().includes(input)
        );
        setFilteredRooms(filtered);
    };

    const handleNewGroupClick = () => {
        setIsNewChat(true);
    };
    const handleJoinGroupClick = () => {
        setIsJoinGroup(true);
    };

    const handleGroupCreate = () => {
        joinGroupAPI(newGroupName);
        setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);
        setNewGroupName("");
        setIsNewChat(false);
    };

    const handleJoinGroup = () => {
        console.log("Group joined:", joinGroupName);
        joinNewGroupAPI(Number.parseInt(joinGroupName));
        setIsNewGroupCreatedOrJoined(!isNewGroupCreatedOrJoined);
        setJoinGroupName("");
        setIsJoinGroup(false);
    };

    const handleModalClose = () => {
        setIsNewChat(false);
    };
    const handleJoinGroupModalClose = () => {
        setIsJoinGroup(false);
    };

    return (
        <div className="main-container">
            <div className={`app-container ${isNewChat || isJoinGroup ? 'blurred' : ''}`}>
                <nav className="navbar">
                    <input
                        type="text"
                        id="search-bar"
                        placeholder="Search Chat"
                        className="search-bar"
                        value={searchText}
                        onChange={(e) => {
                            handleSearchChange(e)
                        }}
                    />
                    <div className="profile-dropdown">
                        <span className="profile-icon">{currentUser ? `(${currentUser.name}) ` : "Fetching "}</span>
                        <span className='profile-icon' onClick={()=>{
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('sessionToken');
                            navigate('/signin');
                        }}>LogOut</span>
                    </div>
                </nav>
                <div className="main-content">
                    <div className="chat-list">
                        <div className="chat-header">
                            <h2>My Chats</h2>
                            <button className="new-chat-button" onClick={handleNewGroupClick}>New Chat +</button>
                            <button className='new-chat-button' onClick={handleJoinGroupClick}>Join Group +</button>
                        </div>
                        <div id="chat-items" className="chat-items">
                            {/* <div className="chat-item" data-name="Piyush">
                                <h4>Piyush</h4>
                                <p>hello</p>
                            </div> */}
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room) => (
                                    <div
                                        key={room.roomId}
                                        className="chat-item"
                                        data-name={room.roomName}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        <h4>{room.roomName}</h4>
                                        <p>{room.isEnded ? "Ended" : "Active"}</p>
                                    </div>
                                ))
                            ) : (
                                <p>How the Hell is it Empty</p>
                            )}
                        </div>
                    </div>
                    <RoomPage room={selectedRoom} isNewGroupCreatedOrJoined={isNewGroupCreatedOrJoined} setIsNewGroupCreatedOrJoined={setIsNewGroupCreatedOrJoined}
                        isToBeRefreshed={isToBeRefreshed} setIsToBeRefreshed={setIsToBeRefreshed} />
                </div>
            </div>
            {isNewChat && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create New Group</h2>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            required
                        />
                        <div className="modal-buttons">
                            <button onClick={handleGroupCreate}>Submit</button>
                            <button onClick={handleModalClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {isJoinGroup && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Join Group</h2>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            value={joinGroupName}
                            onChange={(e) => setJoinGroupName(e.target.value)}
                            required
                        />
                        <div className="modal-buttons">
                            <button onClick={handleJoinGroup}>Submit</button>
                            <button onClick={handleJoinGroupModalClose}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default chatPage;
