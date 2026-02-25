import React, { useState } from "react";

const AddFriend = ({ onAdd }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(name, image);
        setName("");
        setImage(null);
    };

    return (
        <div className="cyber-add-container">
            <div className="cyber-form-content">
                <h2 className="cyber-title">Add a Friend</h2>
                <p className="cyber-subtitle">Bring someone into journey</p>

                <form onSubmit={handleSubmit} className="cyber-form">
                    <div className="upload-btn-wrapper">
                        <label htmlFor="friend-photo-input" className="cyber-upload-label">
                            <span className="upload-icon">📷</span>
                            Upload Photo
                        </label>
                        <input
                            type="file"
                            id="friend-photo-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className="cyber-input-group">
                        <div className="pill-input-wrapper">
                            <input
                                type="text"
                                placeholder="add friends"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="cyber-input-pill"
                            />
                        </div>
                        <button type="submit" className="cyber-btn-pill">
                            add friends
                        </button>
                    </div>

                    {image && (
                        <div className="cyber-preview-mini">
                            <img src={image} alt="Preview" />
                            <span>Image Attached</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddFriend;
