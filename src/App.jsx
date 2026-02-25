import { useState, useEffect } from "react";
import FriendCard from "./Components/FriendCard.jsx";
import AddFriend from "./Components/AddFriend.jsx";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  orderBy
} from "firebase/firestore";

function App() {
  const [friends, setFriends] = useState([]);
  const [currentSection, setCurrentSection] = useState("home"); // home, leaderboard, stats, profile

  // Real-time listener from Firestore
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "friends"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const friendsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriends(friendsList);
    });

    return () => unsubscribe();
  }, []);

  const addFriend = async (name, image) => {
    if (!db) {
      alert("Database not connected. Check your configuration.");
      return;
    }
    const id = Date.now().toString();
    const newFriend = {
      name,
      count: 0,
      image: image || "",
      history: [], // Store { count, message, timestamp }
    };

    try {
      await setDoc(doc(db, "friends", id), newFriend);
    } catch (error) {
      console.error("Error adding friend: ", error);
    }
  };

  const increase = async (id, message = "No message provided") => {
    if (!db) return;
    const friendRef = doc(db, "friends", id);
    const friend = friends.find(f => f.id === id);

    if (!friend) return;

    const newCount = friend.count + 1;
    const newHistoryItem = {
      count: newCount,
      message: message,
      timestamp: new Date().toLocaleString(),
    };

    try {
      await updateDoc(friendRef, {
        count: newCount,
        history: arrayUnion(newHistoryItem)
      });
    } catch (error) {
      console.error("Error increasing count: ", error);
    }
  };

  const decrease = async (id) => {
    if (!db) return;
    const friendRef = doc(db, "friends", id);
    const friend = friends.find(f => f.id === id);

    if (!friend || friend.count <= 0) return;

    // Create a copy of the history and remove the last item
    const newHistory = [...(friend.history || [])];
    newHistory.pop();

    try {
      await updateDoc(friendRef, {
        count: friend.count - 1,
        history: newHistory
      });
    } catch (error) {
      console.error("Error decreasing count: ", error);
    }
  };

  const deleteFriend = async (id) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "friends", id));
    } catch (error) {
      console.error("Error deleting friend: ", error);
    }
  };

  const totalCount = friends.reduce((acc, f) => acc + f.count, 0);
  const sortedFriends = [...friends].sort((a, b) => b.count - a.count);



  if (!db) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', gap: '20px' }}>
        <h2 style={{ color: '#ef4444' }}>Firebase Connection Error</h2>
        <p>Your `.env` file might be missing or configured incorrectly.</p>
        <p>Please check the console for details.</p>
        <button onClick={() => window.location.reload()} className="cyber-btn-pill">Retry Connection</button>
      </div>
    );
  }

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