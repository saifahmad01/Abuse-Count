import { useState, useEffect } from "react";
import FriendCard from "./Components/FriendCard.jsx";
import AddFriend from "./Components/AddFriend.jsx";
import "./App.css";

function App() {
  const [friends, setFriends] = useState([]);
  const [currentSection, setCurrentSection] = useState("home"); // home, leaderboard, stats, profile

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("friends")) || [];
    setFriends(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  const addFriend = (name, image) => {
    const newFriend = {
      id: Date.now(),
      name,
      count: 0,
      image: image,
      history: [], // Store { count, message, timestamp }
    };
    setFriends([...friends, newFriend]);
  };

  const increase = (id, message = "No message provided") => {
    setFriends(
      friends.map((f) => {
        if (f.id === id) {
          const newCount = f.count + 1;
          const newHistoryItem = {
            count: newCount,
            message: message,
            timestamp: new Date().toLocaleString(),
          };
          return {
            ...f,
            count: newCount,
            history: [...f.history, newHistoryItem], // Oldest logs first, new at bottom
          };
        }
        return f;
      })
    );
  };

  const decrease = (id) => {
    setFriends(
      friends.map((f) =>
        f.id === id ? { ...f, count: Math.max(0, f.count - 1) } : f
      )
    );
  };

  const deleteFriend = (id) => {
    setFriends(friends.filter((f) => f.id !== id));
  };

  const totalCount = friends.reduce((acc, f) => acc + f.count, 0);
  const sortedFriends = [...friends].sort((a, b) => b.count - a.count);

  return (
    <div className="container">
      {/* Moon Decor - Top Center */}
      <div className="moon-decor">🌙</div>

      <div className="header-stats">
        <div className="total-count-label">
          Total Abuses: <span className="total-count-value">{totalCount}</span>
        </div>
        <div className="slogan">Ramadan Mein Zubaan Ki Hifazat!</div>
      </div>

      {currentSection === "home" && (
        <div className="home-section active-section">
          <AddFriend onAdd={addFriend} />
          {friends.length === 0 ? (
            <div className="no-participant-msg">No participent</div>
          ) : (
            <div className="friends-grid">
              {friends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  onIncrease={increase}
                  onDecrease={decrease}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {currentSection === "participants" && (
        <div className="participants-section active-section">
          <div className="friends-grid">
            {friends.map((f) => (
              <FriendCard
                key={f.id}
                friend={f}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {currentSection === "leaderboard" && (
        <div className="leaderboard active-section">
          <div className="leaderboard-header">Leaderboard</div>
          <div className="friends-grid">
            {sortedFriends.map((f) => (
              <FriendCard
                key={f.id}
                friend={f}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {currentSection === "profile" && (
        <div className="profile-section active-section">
          <div className="profile-header">Activity Logs</div>
          {friends.length === 0 ? (
            <div className="no-participant-msg">No activity yet</div>
          ) : (
            friends.map((f) => (
              <div key={f.id} className="friend-log-card">
                <div className="friend-log-head">
                  {f.image && <img src={f.image} className="log-friend-img" alt={f.name} />}
                  <span className="log-friend-name">{f.name}</span>
                </div>
                <div className="history-list">
                  {f.history && f.history.length > 0 ? (
                    f.history.map((log, idx) => (
                      <div key={idx} className="history-item">
                        <span className="history-msg">"{log.message}"</span>
                        <div className="history-meta">
                          <span className="history-count-badge">#{log.count}</span>
                          <span className="history-time">{log.timestamp}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="history-msg" style={{ color: '#94a3b8', fontStyle: 'italic' }}>No logs for this friend.</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Navigation Cyber */}
      <div className="bottom-nav">
        <div
          className={`nav-item ${currentSection === "home" ? "active" : ""}`}
          onClick={() => setCurrentSection("home")}
        >
          <i>🏠</i>
          <span>Home</span>
        </div>
        <div
          className={`nav-item ${currentSection === "leaderboard" ? "active" : ""
            }`}
          onClick={() => setCurrentSection("leaderboard")}
        >
          <i>🏆</i>
          <span>Leaderboard</span>
        </div>

        {/* Central Orb */}
        <div className="nav-center-orb" onClick={() => {
          setCurrentSection("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          <div className="orb-glow"></div>
          <div className="orb-content">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2822/2822765.png"
              className="orb-image"
              alt="Mosque"
            />
          </div>
        </div>

        <div
          className={`nav-item ${currentSection === "participants" ? "active" : ""}`}
          onClick={() => setCurrentSection("participants")}
        >
          <i>📈</i>
          <span>Participants</span>
        </div>
        <div
          className={`nav-item ${currentSection === "profile" ? "active" : ""}`}
          onClick={() => setCurrentSection("profile")}
        >
          <i>👤</i>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
}

export default App;