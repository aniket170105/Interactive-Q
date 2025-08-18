import React, { useState } from "react";
import { createPortal } from 'react-dom';
import { useToast } from '../../components/ToastProvider.jsx'
import { io } from 'socket.io-client';

// const socket = io("http://localhost:3000");

const sendMessage = async (message, isAnonymous, roomId, socket) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('http://localhost:8081/user/room/message/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${refreshToken}`
    },
    body: JSON.stringify({"isAnonymous" : isAnonymous, "text": message, "isPoll": false, "roomId": roomId}),
  });
  if(response.ok){
    console.log("Message sent successfully!");
    socket.emit("message", { "room": roomId, "message" : await response.json() });
  }
  else{
    console.log("Error while sending message");
    // alert(await response.text());
  }
};

const sendPoll = async (pollQuestion, pollOptions, isAnonymous, roomId, socket, notify) => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('http://localhost:8081/user/room/poll/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${refreshToken}`
    },
    body: JSON.stringify({"isAnonymous" : isAnonymous, "text": pollQuestion, "pollOptions": pollOptions, "roomId": roomId, "isPoll": true}),
  });
  if(response.ok){
    console.log("Poll sent successfully!");
    socket.emit("message", { "room": roomId, "message" : await response.json() });
  }
  else{
    notify(await response.text(), { type: 'error' });
  }
};

const ChatInput = ({room, socket}) => {
  const [isNewPoll, setIsNewPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState([""]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { notify } = useToast();

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
  sendPoll(pollQuestion, pollOptions, isAnonymous, room.roomId, socket, notify);
    setIsNewPoll(false); // Close modal
  };

  const handlePollCancel = () => {
    setIsNewPoll(false); // Close modal
    setPollOptions([""]); // Reset options
    setPollQuestion(""); // Reset question
  };

  const handleSendMessage = () => {
    sendMessage(newMessage, isAnonymous, room.roomId, socket);
    setNewMessage("");
  };

  return (
    <div>
  <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 p-3 sm:p-4 glass border-t border-neutral-200/60 dark:border-neutral-700/50 w-full">
        <button
          onClick={() => setIsNewPoll(true)}
          className="text-2xl text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white px-2"
        >
          +
        </button>
  <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
            className="scale-110 accent-black dark:accent-white"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Anonymous</span>
        </label>
        <input
          type="text"
          placeholder="Enter a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="min-w-[160px] flex-1 input"
        />
        <button
          onClick={handleSendMessage}
          className="btn"
        >
          Send
        </button>
      </div>

      {isNewPoll && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
          <div className="card p-4 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Create Poll</h2>
            <input
              type="text"
              placeholder="Enter poll question"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="input mb-4"
            />
            {pollOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="input mb-2"
              />
            ))}
            <button
              onClick={handleAddOption}
              className="w-full btn-ghost mb-4"
            >
              Add Option
            </button>
            <div className="flex items-center justify-between">
              <button
                onClick={handlePollSend}
                className="btn"
              >
                Send
              </button>
              <button
                onClick={handlePollCancel}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChatInput;
