import React from 'react';
import "./styles.css";

const chatPage = () => {
    return (
        <div className="main-container">
            <div className="app-container">
                <nav className="navbar">
                    <input 
                        type="text" 
                        id="search-bar" 
                        placeholder="Search Chat" 
                        className="search-bar" 
                    />
                    <div className="profile-dropdown">
                        <span className="profile-icon">Profile</span>
                        <div className="dropdown-content">
                            <button>Logout</button>
                        </div>
                    </div>
                </nav>
                <div className="main-content">
                    <div className="chat-list">
                        <div className="chat-header">
                            <h2>My Chats</h2>
                            <button className="new-chat-button">New Chat +</button>
                            <button className='new-chat-button'>Join Group +</button>
                        </div>
                        <div id="chat-items" className="chat-items">
                            <div className="chat-item" data-name="Piyush">
                                <h4>Piyush</h4>
                                <p>hello</p>
                            </div>
                            <div className="chat-item" data-name="Guest User">
                                <h4>Guest User</h4>
                                <p>woooo</p>
                            </div>
                            <div className="chat-item" data-name="Time">
                                <h4>Time</h4>
                                <p>yo</p>
                            </div>
                            <div className="chat-item" data-name="RoadSide Coder Fam">
                                <h4>RoadSide Coder Fam</h4>
                                <p>💪❤️</p>
                            </div>
                            <div className="chat-item" data-name="Youtube Demo">
                                <h4>Youtube Demo</h4>
                                <p>ssup</p>
                            </div>
                            <div className="chat-item" data-name="Karle Vedant Prasad">
                                <h4>Karle Vedant Prasad</h4>
                                <p>hello there</p>
                            </div>
                        </div>
                    </div>
                    <div className="chat-window">
                        <div className="chat-header">
                            <h2>DEMO FOR YOUTUBE</h2>
                            <div className="options-menu">
                                <span className="eye-icon">
                                    <img 
                                        src="three-dots-vertical-svgrepo-com.svg" 
                                        alt="Details" 
                                        id="view-members" 
                                    />
                                </span>
                                <div className="dropdown-content">
                                    <button>Exit Group</button>
                                </div>
                            </div>
                        </div>
                        <div className="chat-content" id="chat-content">
                            <p>No messages yet...</p>
                        </div>
                        <div className="chat-input">
                            <input 
                                type="text" 
                                placeholder="Enter a message..." 
                            />
                        </div>
                        {/* <div className="group-members" id="group-members" style={{ display: 'none' }}>
                            <button id="close-members" className="close-members">✖</button>
                            <ul id="members-list">
                                <li>
                                    <span>Piyush</span>
                                    <button className="remove-member">Remove</button>
                                </li>
                                <li>
                                    <span>Guest User</span>
                                    <button className="remove-member">Remove</button>
                                </li>
                                <li>
                                    <span>Time</span>
                                    <button className="remove-member">Remove</button>
                                </li>
                                <li>
                                    <span>RoadSide Coder Fam</span>
                                    <button className="remove-member">Remove</button>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>
            {/* <script src="script.js"></script> */}
        </div>
    );
};

export default chatPage;
