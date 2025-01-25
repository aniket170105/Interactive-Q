import React from "react";
import "./memberSidebar.css";

const MemberSidebar = ({ members, onClose, handleMemberAction }) => {
  return (
    <div className="sidebar open">
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
              {member.isAuthenticated ? (
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
