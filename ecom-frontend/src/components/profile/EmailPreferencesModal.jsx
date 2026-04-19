import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaTimes, FaEnvelope, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';

const EmailPreferencesModal = ({ open, setOpen }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BACK_END_URL;

    const [preferences, setPreferences] = useState({
        marketingEmails: true,
        orderUpdateEmails: true,
        promotionalEmails: true
    });

    useEffect(() => {
        if (user) {
            setPreferences({
                marketingEmails: user.marketingEmails ?? true,
                orderUpdateEmails: user.orderUpdateEmails ?? true,
                promotionalEmails: user.promotionalEmails ?? true
            });
        }
    }, [user, open]);

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Only send the fields that UserDTO expects to avoid 400 errors
            // due to field mismatches (like roles as strings vs Role objects)
            const payload = {
                username: user.username,
                email: user.email,
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                marketingEmails: preferences.marketingEmails,
                orderUpdateEmails: preferences.orderUpdateEmails,
                promotionalEmails: preferences.promotionalEmails,
                avatar: user.avatar
            };

            const res = await axios.put(`${API_URL}/api/users/profile`, payload, {
                withCredentials: true
            });
            
            // Merge response data back into user store
            // The backend returns a UserDTO which has 'username' and 'email'
            const updatedUser = { ...user, ...res.data };
            dispatch({ type: "LOGIN_USER", payload: updatedUser });
            localStorage.setItem("auth", JSON.stringify(updatedUser));
            
            toast.success("Preferences saved!");
            setOpen(false);
        } catch (error) {
            console.error("Error saving preferences", error);
            const message = error.response?.data?.message || "Failed to save preferences";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const Toggle = ({ label, description, isEnabled, onToggle }) => (
        <div className="flex items-center justify-between py-4">
            <div className="flex-1 pr-4">
                <h3 className="text-gray-800 font-semibold">{label}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
            <button 
                onClick={onToggle}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out relative focus:outline-none ${isEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center`}>
                    {isEnabled && <FaCheck className="text-purple-600 p-0.5" size={10} />}
                </div>
            </button>
        </div>
    );

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />

            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="relative w-full max-w-md mx-auto transform overflow-hidden bg-white rounded-2xl shadow-2xl transition-all">
                    <div className="px-8 py-8">
                        <DialogTitle className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FaEnvelope className="mr-3 text-purple-600" /> Email Preferences
                        </DialogTitle>
                        
                        <div className="divide-y divide-gray-100">
                            <Toggle 
                                label="Order Updates" 
                                description="Get notified about your order status, shipping, and delivery."
                                isEnabled={preferences.orderUpdateEmails}
                                onToggle={() => handleToggle('orderUpdateEmails')}
                            />
                            <Toggle 
                                label="Promotional Offers" 
                                description="Receive special discounts, sales, and personalized offers."
                                isEnabled={preferences.promotionalEmails}
                                onToggle={() => handleToggle('promotionalEmails')}
                            />
                            <Toggle 
                                label="Marketing Newsletter" 
                                description="Stay updated with our latest products and collections."
                                isEnabled={preferences.marketingEmails}
                                onToggle={() => handleToggle('marketingEmails')}
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
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition font-bold shadow-lg shadow-purple-200 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Preferences"}
                            </button>
                        </div>
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

export default EmailPreferencesModal;
