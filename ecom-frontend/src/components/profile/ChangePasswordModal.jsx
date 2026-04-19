import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaTimes, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ChangePasswordModal = ({ open, setOpen }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BACK_END_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match!");
        }

        if (passwords.newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }

        setLoading(true);
        try {
            await axios.put(`${API_URL}/api/users/password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, {
                withCredentials: true
            });
            
            toast.success("Password updated successfully!");
            setOpen(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Password update error", error);
            const message = error.response?.data?.message || "Failed to update password";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />

            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="relative w-full max-w-md mx-auto transform overflow-hidden bg-white rounded-2xl shadow-2xl transition-all">
                    <div className="px-8 py-8">
                        <DialogTitle className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaLock className="mr-3 text-purple-600" /> Change Password
                        </DialogTitle>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <hr className="border-gray-100" />

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button 
                                    type="button" 
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition font-bold"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition font-bold shadow-lg shadow-purple-200 disabled:opacity-50"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <button 
                        onClick={() => setOpen(false)} 
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default ChangePasswordModal;
