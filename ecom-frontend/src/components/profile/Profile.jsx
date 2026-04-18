import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaUser, FaEnvelope, FaShieldAlt, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_BACK_END_URL;

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/users/addresses`, {
                    withCredentials: true
                });
                setAddresses(response.data);
            } catch (error) {
                console.error("Error fetching addresses", error);
                toast.error("Failed to load addresses");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAddresses();
        }
    }, [user, API_URL]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-custom-gradient h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="bg-white p-2 rounded-full shadow-lg">
                                <div className="bg-gray-200 h-24 w-24 rounded-full flex items-center justify-center text-gray-500">
                                    <FaUser size={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                                <p className="text-gray-500 flex items-center mt-1">
                                    <FaEnvelope className="mr-2" /> {user?.email}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {user?.roles?.map((role, idx) => (
                                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center capitalize">
                                        <FaShieldAlt className="mr-1" /> {role.replace('ROLE_', '').toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-purple-600" /> Saved Addresses
                                </h2>
                                <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center">
                                    <FaPlus className="mr-2" /> Add New
                                </button>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl"></div>
                                    ))}
                                </div>
                            ) : addresses.length > 0 ? (
                                <div className="grid gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.addressId} className="border border-gray-100 rounded-xl p-4 hover:border-purple-200 transition duration-300 bg-gray-50/50">
                                            <p className="font-semibold text-gray-800">{addr.buildingName}, {addr.street}</p>
                                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p className="text-sm text-gray-600 capitalize">{addr.country}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <p>No addresses saved yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1">
                         <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                            <div className="space-y-4">
                                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition">
                                    Change Password
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition">
                                    Email Preferences
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition">
                                    Deactivate Account
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
