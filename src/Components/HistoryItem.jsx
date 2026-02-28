import React, { useState, useRef, useEffect } from "react";

const HistoryItem = ({ log, index, onDeleteRequest }) => {
    const [holdProgress, setHoldProgress] = useState(0);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const holdTimerRef = useRef(null);
    const itemRef = useRef(null);

    const startHold = (e) => {
        if (isDeleteVisible) return;
        setHoldProgress(0);
        const startTime = Date.now();
        const duration = 1500; // 1.5 seconds for history items

        holdTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setHoldProgress(progress);

            if (elapsed >= duration) {
                clearInterval(holdTimerRef.current);
                setIsDeleteVisible(true);
                setHoldProgress(0);
            }
        }, 50);
    };

    const stopHold = () => {
        clearInterval(holdTimerRef.current);
        setHoldProgress(0);
    };

    // Close delete button if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (itemRef.current && !itemRef.current.contains(event.target)) {
                setIsDeleteVisible(false);
            }
        };
        if (isDeleteVisible) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isDeleteVisible]);

    return (
        <div
            className={`history-item ${isDeleteVisible ? 'delete-mode' : ''}`}
            ref={itemRef}
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
        >
            <div className="history-content">
                <span className="history-msg">"{log.message}"</span>
                <div className="history-meta">
                    <span className="history-count-badge">#{log.count}</span>
                    <span className="history-time">{log.timestamp}</span>
                </div>
            </div>

            {isDeleteVisible && (
                <button
                    className="history-delete-btn revealed"
                    onClick={() => onDeleteRequest(index)}
                    title="Delete message"
                >
                    ✕
                </button>
            )}

            {holdProgress > 0 && (
                <div
                    className="history-hold-indicator"
                    style={{ width: `${holdProgress}%` }}
                ></div>
            )}
        </div>
    );
};

export default HistoryItem;
