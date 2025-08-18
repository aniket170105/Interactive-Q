import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RoomPage from './RoomPage';
import { ThemeToggleButton } from '../../theme/ThemeProvider.jsx'
import { useToast } from '../../components/ToastProvider.jsx'

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
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const { notify } = useToast();

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
        <div className="h-screen w-full bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
            <div className={`h-full w-full flex flex-col ${isNewChat || isJoinGroup ? 'blur-sm pointer-events-none select-none' : ''}`}>
                <nav className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900/80">
                    <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        onClick={() => setMobileDrawerOpen(true)} aria-label="Open chats">
                        ☰
                    </button>
                    <input
                        type="text"
                        id="search-bar"
                        placeholder="Search Chat"
                        className="min-w-[160px] flex-1 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-md px-2 sm:px-3 py-2 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                        value={searchText}
                        onChange={(e) => {
                            handleSearchChange(e)
                        }}
                    />
                    <div className="flex items-center gap-2 sm:gap-3 text-sm">
                        <ThemeToggleButton />
                        <span className="text-neutral-600 dark:text-neutral-300">{currentUser ? `(${currentUser.name}) ` : "Fetching "}</span>
                        <button className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={()=>{
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('sessionToken');
                            navigate('/signin');
                        }}>Log Out</button>
                    </div>
                </nav>
                <div className="flex flex-1 min-h-0 overflow-hidden">
                    <div className="hidden md:flex w-full max-w-sm border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 flex-col">
                        <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
                            <h2 className="font-semibold">My Chats</h2>
                            <div className="flex items-center gap-2">
                                <button className="px-2 py-1.5 text-sm rounded-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700" onClick={handleNewGroupClick}>New Chat +</button>
                                <button className='px-2 py-1.5 text-sm rounded-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700' onClick={handleJoinGroupClick}>Join Group +</button>
                            </div>
                        </div>
                        <div id="chat-items" className="flex-1 overflow-y-auto p-3 space-y-2">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room) => (
                                    <div
                                        key={room.roomId}
                                        className="p-3 rounded-lg bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 cursor-pointer"
                                        data-name={room.roomName}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white">{room.roomName}</h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{room.isEnded ? "Ended" : "Active"}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">No rooms found</p>
                            )}
                        </div>
                    </div>
                    <RoomPage room={selectedRoom} isNewGroupCreatedOrJoined={isNewGroupCreatedOrJoined} setIsNewGroupCreatedOrJoined={setIsNewGroupCreatedOrJoined}
                        isToBeRefreshed={isToBeRefreshed} setIsToBeRefreshed={setIsToBeRefreshed} />
                </div>
                                {/* Mobile Drawer */}
                                {mobileDrawerOpen && (
                                    <div className="fixed inset-0 z-50 md:hidden">
                                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileDrawerOpen(false)} />
                                        <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col">
                                            <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
                                                <h2 className="font-semibold">My Chats</h2>
                                                <button className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white" onClick={() => setMobileDrawerOpen(false)}>✖</button>
                                            </div>
                                            <div className="p-3 flex items-center gap-2">
                                                <button className="px-2 py-1.5 text-sm rounded-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700" onClick={()=>{handleNewGroupClick(); setMobileDrawerOpen(false);}}>New Chat +</button>
                                                <button className='px-2 py-1.5 text-sm rounded-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700' onClick={()=>{handleJoinGroupClick(); setMobileDrawerOpen(false);}}>Join Group +</button>
                                            </div>
                                            <div id="chat-items-mobile" className="flex-1 overflow-y-auto p-3 space-y-2">
                                                {filteredRooms.length > 0 ? (
                                                    filteredRooms.map((room) => (
                                                        <div key={room.roomId} className="p-3 rounded-lg bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 cursor-pointer"
                                                                 onClick={() => { setSelectedRoom(room); setMobileDrawerOpen(false); }}>
                                                            <h4 className="text-sm font-medium text-neutral-900 dark:text-white">{room.roomName}</h4>
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{room.isEnded ? 'Ended' : 'Active'}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 px-3">No rooms found</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
            </div>

            {isNewChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white border border-neutral-200 rounded-xl p-5 w-full max-w-sm shadow-xl dark:bg-neutral-900 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold mb-3">Create New Group</h2>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            required
                            className="w-full rounded-md bg-neutral-100 border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                        />
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={handleModalClose}>Cancel</button>
                            <button className="px-3 py-1.5 rounded-md bg-black text-white font-medium hover:opacity-90 dark:bg-white dark:text-black" onClick={handleGroupCreate}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
            {isJoinGroup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white border border-neutral-200 rounded-xl p-5 w-full max-w-sm shadow-xl dark:bg-neutral-900 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold mb-3">Join Group</h2>
                        <input
                            type="text"
                            placeholder="Enter group id"
                            value={joinGroupName}
                            onChange={(e) => setJoinGroupName(e.target.value)}
                            required
                            className="w-full rounded-md bg-neutral-100 border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                        />
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={handleJoinGroupModalClose}>Cancel</button>
                            <button className="px-3 py-1.5 rounded-md bg-black text-white font-medium hover:opacity-90 dark:bg-white dark:text-black" onClick={handleJoinGroup}>Submit</button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default chatPage;
