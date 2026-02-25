import React, { useState, useEffect, useRef } from "react";

const FriendCard = ({ friend, onIncrease, onDecrease, showActions = true }) => {
    const [isLogging, setIsLogging] = useState(false);
    const [logMessage, setLogMessage] = useState("");
    const inputAreaRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputAreaRef.current && !inputAreaRef.current.contains(event.target)) {
                setIsLogging(false);
            }
        };

        if (isLogging) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isLogging]);

    const handleConfirmIncrease = () => {
        if (!logMessage.trim()) return;
        onIncrease(friend.id, logMessage);
        setLogMessage("");
        setIsLogging(false);
    };

    return (
        <div className="card">
            <div className="friend-img-container">
                {friend.image ? (
                    <img src={friend.image} alt={friend.name} className="friend-img" />
                ) : (
                    <div className="friend-img-placeholder" style={{ width: '100%', height: '100%', background: '#eee' }}></div>
                )}
            </div>
            <div className="card-info">
                <h3>{friend.name}</h3>
                <div className="count-number">{friend.count}</div>
                {showActions && isLogging && (
                    <div className="log-input-area" ref={inputAreaRef} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            placeholder="Enter message..."
                            value={logMessage}
                            onChange={(e) => setLogMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmIncrease()}
                            className="log-input"
                            autoFocus
                        />
                        <div className="log-btns">
                            <button className="btn-log-cancel" onClick={() => setIsLogging(false)}>Cancel</button>
                            <button className="btn-log-confirm" onClick={handleConfirmIncrease}>Save</button>
                        </div>
                    </div>
                )}
            </div>

            {showActions && (
                <div className="card-actions">
                    {!isLogging && (
                        <>
                            <button className="btn-count btn-minus" onClick={() => onDecrease(friend.id)}>
                                -
                            </button>
                            <button className="btn-count btn-plus" onClick={() => setIsLogging(true)}>
                                +
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FriendCard;
