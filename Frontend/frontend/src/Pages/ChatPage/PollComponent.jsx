import { useState, useEffect } from "react";
import "./PollComponent.css";
import { use } from "react";

const PollComponent = ({ message, pollOptions, voteAPI, currentUser, socket}) => {
    // Track the user's selected option
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const userHasVoted = pollOptions.some(option => 
            option.userVoted.some(user => user.userId === currentUser.userId)
        );
        setHasVoted(userHasVoted);
        setSelectedOption(userHasVoted ? pollOptions.find(option => 
            option.userVoted.some(user => user.userId === currentUser.userId)
        )?.optId : null);
    }, [pollOptions, message]);

    // console.log("has voted : " + hasVoted + " " + message.text);
    return (
        <div>
            {message.isPoll ? (
                <div>
                    <p>{message.text}</p>
                    {pollOptions.map((option) => {
                        const userVotedForThis = option.userVoted.some(user => user.userId === currentUser.userId);

                        return (
                            <div key={option.optId} className="poll-option">
                                <input
                                    type="radio"
                                    id={`option-${option.optId}`}
                                    name={`poll-${message.messageId}`}
                                    checked={selectedOption ? selectedOption === option.optId : userVotedForThis}
                                    disabled={hasVoted}
                                    onChange={() => {
                                        voteAPI(option.optId, socket);
                                        setHasVoted(true);
                                    }}
                                    className="custom-radio"
                                />
                                <label htmlFor={`option-${option.optId}`} style={{ marginLeft: "8px" }} className="poll-label">
                                    {option.optText}
                                </label>
                                <span style={{ marginLeft: "8px" }} className="vote-count">
                                    ({option.userVoted.length} votes)
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>{message.text}</p>
            )}
        </div>
    );
};

export default PollComponent;
