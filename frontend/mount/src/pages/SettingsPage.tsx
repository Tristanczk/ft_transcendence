import React, { useState } from 'react';
import ToggleButton from '../components/ToggleButton';
const SettingsPage: React.FC = () => {
    const [newUserName, setNewUserName] = useState('');
    const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

    const handleUserNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNewUserName(event.target.value);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewAvatarUrl(event.target.value);
    };

    const handleTwoFactorToggle = () => {
        setIsTwoFactorEnabled((prev) => !prev);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // In a real application, you would save the new username, avatar URL, and two-factor authentication setting to the server.
        console.log('New Username:', newUserName);
        console.log('New Avatar URL:', newAvatarUrl);
        console.log('Two-Factor Authentication:', isTwoFactorEnabled);
    };

    return (
        <div>
            <h1>Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={newUserName}
                        onChange={handleUserNameChange}
                    />
                </div>
                <div>
                    <label htmlFor="avatar">Avatar URL:</label>
                    <input
                        type="text"
                        id="avatar"
                        value={newAvatarUrl}
                        onChange={handleAvatarChange}
                    />
                </div>
                <div>
                    <ToggleButton
                        checked={isTwoFactorEnabled}
                        onClick={handleTwoFactorToggle}
                    ></ToggleButton>
                </div>
                <div>
                    <img
                        src={newAvatarUrl}
                        alt="User Avatar"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default SettingsPage;
