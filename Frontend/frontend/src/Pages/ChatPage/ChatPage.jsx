import React from 'react';
import "./styles.css";


const chatPage = () => {
    return (
        <div class="main-container">
            <div class="app-container">
                <nav class="navbar">
                    <input type="text" id="search-bar" placeholder="Search Chat" class="search-bar"/>
                        <div class="profile-dropdown">
                            <span class="profile-icon">Profile</span>
                            <div class="dropdown-content">
                                <button>Logout</button>
                            </div>
                        </div>
                </nav>
                <div class="main-content">
                    <div class="chat-list">
                        <div class="chat-header">
                            <h2>My Chats</h2>
                            <button class="new-chat-button">New Group Chat +</button>
                        </div>
                        <div id="chat-items" class="chat-items">
                            <div class="chat-item" data-name="Piyush">
                                <h4>Piyush</h4>
                                <p>hello</p>
                            </div>
                            <div class="chat-item" data-name="Guest User">
                                <h4>Guest User</h4>
                                <p>woooo</p>
                            </div>
                            <div class="chat-item" data-name="Time">
                                <h4>Time</h4>
                                <p>yo</p>
                            </div>
                            <div class="chat-item" data-name="RoadSide Coder Fam">
                                <h4>RoadSide Coder Fam</h4>
                                <p>💪❤️</p>
                            </div>
                            <div class="chat-item" data-name="Youtube Demo">
                                <h4>Youtube Demo</h4>
                                <p>ssup</p>
                            </div>
                            <div class="chat-item" data-name="Karle Vedant Prasad">
                                <h4>Karle Vedant Prasad</h4>
                                <p>hello there</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-window">
                        <div class="chat-header">
                            <h2>DEMO FOR YOUTUBE</h2>
                            <div class="options-menu">
                                <span class="eye-icon">
                                    <img src="three-dots-vertical-svgrepo-com.svg" alt="Details" id="view-members"/>
                                </span>
                                <div class="dropdown-content">
                                    <button>Exit Group</button>
                                </div>
                            </div>
                        </div>
                        <div class="chat-content" id="chat-content">
                            <p>No messages yet...</p>
                        </div>
                        <div class="chat-input">
                            <input type="text" placeholder="Enter a message..."/>
                        </div>
                        {/* <div class="group-members" id="group-members" style="display: none;">
                            <button id="close-members" class="close-members">✖</button>
                            <ul id="members-list">
                                <li>
                                    <span>Piyush</span>
                                    <button class="remove-member">Remove</button>
                                </li>
                                <li>
                                    <span>Guest User</span>
                                    <button class="remove-member">Remove</button>
                                </li>
                                <li>
                                    <span>Time</span>
                                    <button class="remove-member">Remove</button>
                                </li>
                                <li>
                                    <span>RoadSide Coder Fam</span>
                                    <button class="remove-member">Remove</button>
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