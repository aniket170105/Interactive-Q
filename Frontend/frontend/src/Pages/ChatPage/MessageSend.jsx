import React, { useState } from "react";

const ChatInput = () => {
  const [isNewPoll, setIsNewPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState([""]);
  const [pollQuestion, setPollQuestion] = useState("");

  const handleAddOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const handlePollSend = () => {
    console.log("Poll Question:", pollQuestion);
    console.log("Poll Options:", pollOptions);
    setIsNewPoll(false); // Close modal
  };

  const handlePollCancel = () => {
    setIsNewPoll(false); // Close modal
    setPollOptions([""]); // Reset options
    setPollQuestion(""); // Reset question
  };

  return (
    <div>
      <div
        className="chat-input"
        style={{
          padding: "16px",
          background: "#1e1e1e",
          position: "sticky",
          bottom: "0",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setIsNewPoll(true)}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            color: "#d3d3d3",
            cursor: "pointer",
          }}
        >
          +
        </button>
        <input
          type="text"
          placeholder="Enter a message..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #444",
            borderRadius: "4px",
            backgroundColor: "#2b2b2b",
            color: "#d3d3d3",
          }}
        />
        <button
          style={{
            backgroundColor: "#444",
            color: "#d3d3d3",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      {isNewPoll && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal"
            style={{
              background: "#2b2b2b",
              padding: "16px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              color: "#d3d3d3",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h2 style={{ color: "#d3d3d3" }}>Create Poll</h2>
            <input
              type="text"
              placeholder="Enter poll question"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "16px",
                border: "1px solid #444",
                borderRadius: "4px",
                backgroundColor: "#3b3b3b",
                color: "#d3d3d3",
              }}
            />
            {pollOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  backgroundColor: "#3b3b3b",
                  color: "#d3d3d3",
                }}
              />
            ))}
            <button
              onClick={handleAddOption}
              style={{
                backgroundColor: "#444",
                color: "#d3d3d3",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "16px",
                width: "100%",
              }}
            >
              Add Option
            </button>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handlePollSend}
                style={{
                  backgroundColor: "#444",
                  color: "#d3d3d3",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
              <button
                onClick={handlePollCancel}
                style={{
                  backgroundColor: "#666",
                  color: "#d3d3d3",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
