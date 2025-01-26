import React, { useEffect } from "react";
import "./memberSidebar.css";
import { use } from "react";

const MemberSidebar = ({ members, onClose, handleMemberAction }) => {

    useEffect(() => {

    }, [members]);

    return (
        <div className="sidebar open" style={{ overflowY: "auto" }}>
            <div className="sidebar-header">
                <span>Group Members</span>
                <button className="close-sidebar" onClick={onClose}>
                    ✖
                </button>
            </div>
            <div className="member-list">
                {members.map((member) => (
                    <div className="member-item" key={member.person.userId}>
                        <span>{member.person.name}</span>
                        <div className="member-actions">
                            {member.isAuthenticated && !member.isExited ? (
                                <button
                                    className="remove-button"
                                    onClick={() => handleMemberAction("remove", member.person.userId)}
                                >
                                    Remove
                                </button>
                            ) : !member.isExited ? (
                                <>
                                    <button
                                        className="accept-button"
                                        onClick={() => handleMemberAction("accept", member.person.userId)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="reject-button"
                                        onClick={() => handleMemberAction("reject", member.person.userId)}
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberSidebar;
