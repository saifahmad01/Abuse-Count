import React, { useState, useEffect, useRef } from "react";

const FriendCard = ({ friend, onIncrease, onDecrease, showActions = true }) => {
    const [isLogging, setIsLogging] = useState(false);
    const [logMessage, setLogMessage] = useState("");
    const [isSubmittingPin, setIsSubmittingPin] = useState(false);
    const [pin, setPin] = useState("");
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimerRef = useRef(null);
    const inputAreaRef = useRef(null);
    const pinAreaRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputAreaRef.current && !inputAreaRef.current.contains(event.target)) {
                setIsLogging(false);
            }
            if (pinAreaRef.current && !pinAreaRef.current.contains(event.target)) {
                setIsSubmittingPin(false);
                setPin("");
            }
        };

        if (isLogging || isSubmittingPin) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isLogging, isSubmittingPin]);

    const handleConfirmIncrease = () => {
        if (!logMessage.trim()) return;
        onIncrease(friend.id, logMessage);
        setLogMessage("");
        setIsLogging(false);
    };

    const handlePinSubmit = (e) => {
        if (e) e.preventDefault();
        if (pin === "786") {
            onDecrease(friend.id);
            setIsSubmittingPin(false);
            setPin("");
        } else {
            alert("Incorrect PIN!");
            setPin("");
        }
    };

    const startHold = () => {
        setHoldProgress(0);
        const startTime = Date.now();
        const duration = 2000;

        holdTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setHoldProgress(progress);

            if (elapsed >= duration) {
                clearInterval(holdTimerRef.current);
                setIsSubmittingPin(true);
                setHoldProgress(0);
            }
        }, 50);
    };

    const stopHold = () => {
        clearInterval(holdTimerRef.current);
        setHoldProgress(0);
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
                <div className="count-number">{friend.history ? friend.history.length : 0}</div>

                {/* Abuse Log Prompt */}
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

                {/* Subtraction PIN Prompt */}
                {showActions && isSubmittingPin && (
                    <div className="log-input-area" ref={pinAreaRef} onClick={(e) => e.stopPropagation()}>
                        <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 'bold' }}>Enter PIN to Subtract</div>
                        <input
                            type="password"
                            placeholder="PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                            className="log-input"
                            style={{ textAlign: 'center', letterSpacing: '8px' }}
                            autoFocus
                        />
                        <div className="log-btns">
                            <button className="btn-log-cancel" onClick={() => { setIsSubmittingPin(false); setPin(""); }}>Cancel</button>
                            <button className="btn-log-confirm" onClick={handlePinSubmit} style={{ background: '#ef4444' }}>Unlock</button>
                        </div>
                    </div>
                )}
            </div>

            {showActions && (
                <div className="card-actions">
                    {!isLogging && !isSubmittingPin && (
                        <>
                            <div className="minus-btn-wrapper" style={{ position: 'relative' }}>
                                <button
                                    className="btn-count btn-minus"
                                    onMouseDown={startHold}
                                    onMouseUp={stopHold}
                                    onMouseLeave={stopHold}
                                    onTouchStart={startHold}
                                    onTouchEnd={stopHold}
                                    style={{ overflow: 'hidden' }}
                                >
                                    -
                                    {holdProgress > 0 && (
                                        <div
                                            className="hold-indicator"
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                height: '4px',
                                                background: '#ef4444',
                                                width: `${holdProgress}%`,
                                                transition: 'width 0.1s linear'
                                            }}
                                        ></div>
                                    )}
                                </button>
                                {holdProgress > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-25px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '0.6rem',
                                        whiteSpace: 'nowrap',
                                        color: '#ef4444',
                                        fontWeight: 'bold'
                                    }}>
                                        HOLD...
                                    </div>
                                )}
                            </div>

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

