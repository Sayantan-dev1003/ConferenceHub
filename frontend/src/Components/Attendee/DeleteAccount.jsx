import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = ({ isOpen, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete('/api/delete/account', { data: { password } }, { withCredentials: true });
            alert(response.data.message); // Show success message
            onClose();
            navigate("/");
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error deleting account');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">⚠️ Are you sure you want to delete your account?</h2>
                <p>Deleting your account will permanently remove all your data, including:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>✅ Your event registrations & tickets</li>
                    <li>✅ Saved preferences & settings</li>
                    <li>✅ Payment history (if applicable)</li>
                    <li>✅ Notifications & reminders</li>
                </ul>
                <p>Once deleted, this action CANNOT be undone.</p>
                <p>🔒 Alternative: If you just want to take a break, you can log out instead.</p>
                <p>❌ To proceed, confirm by entering your password:</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md w-full p-2 mb-4"
                    placeholder="Password"
                />
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-between">
                    <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete My Account</button>
                    <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;