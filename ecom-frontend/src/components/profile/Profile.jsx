import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FaUser, FaEnvelope, FaShieldAlt, FaMapMarkerAlt, FaPlus, FaEdit, FaCamera } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import AddressInfoModal from '../checkout/AddressInfoModal';
import AddAddressForm from '../checkout/AddAddressForm';
import ChangePasswordModal from './ChangePasswordModal';
import EmailPreferencesModal from './EmailPreferencesModal';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_BACK_END_URL;

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ username: '', email: '', fullName: '', phoneNumber: '' });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const [openEmailModal, setOpenEmailModal] = useState(false);

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
            setEditData({ 
                username: user.username, 
                email: user.email,
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user, API_URL, openAddressModal]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${API_URL}/api/users/profile`, editData, {
                withCredentials: true
            });
            const updatedUser = { ...user, ...res.data };
            
            // If username changed, we need to alert the user that they might be logged out
            if (user.username !== res.data.username) {
                toast.success("Username changed! redirecting to login...");
                setTimeout(() => {
                    dispatch({ type: "LOG_OUT" });
                    localStorage.removeItem("auth");
                    window.location.href = "/login";
                }, 2000);
                return;
            }

            dispatch({ type: "LOGIN_USER", payload: updatedUser });
            localStorage.setItem("auth", JSON.stringify(updatedUser));
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("image", file);

        const toastId = toast.loading("Uploading your photo...");

        try {
            const res = await axios.post(`${API_URL}/api/users/profile/avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            const updatedUser = { ...user, avatar: res.data.avatar };
            dispatch({ type: "LOGIN_USER", payload: updatedUser });
            localStorage.setItem("auth", JSON.stringify(updatedUser));
            setAvatarPreview(null); // Clear preview on success
            if (fileInputRef.current) fileInputRef.current.value = ""; // Clear input
            toast.success("Profile picture updated!", { id: toastId });
        } catch (error) {
            setAvatarPreview(null); // Clear preview on error
            toast.error("Failed to upload picture", { id: toastId });
        }
    };

    const handleDeactivationRequest = async () => {
        if (!window.confirm("Are you sure you want to request account deactivation? This action requires admin approval.")) return;
        
        try {
            const res = await axios.post(`${API_URL}/api/users/deactivate/request`, {}, {
                withCredentials: true
            });
            const updatedUser = { ...user, deactivationRequested: true };
            dispatch({ type: "LOGIN_USER", payload: updatedUser });
            localStorage.setItem("auth", JSON.stringify(updatedUser));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 relative">
                    <div className="bg-custom-gradient h-32 relative">
                        <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center transition duration-300">
                            <FaEdit className="mr-2" /> Edit Profile
                        </button>
                        <div className="absolute -bottom-16 left-8">
                            <div className="bg-white p-1 rounded-full shadow-2xl relative group ring-4 ring-white">
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Preview" 
                                        className="h-32 w-32 rounded-full object-cover border-4 border-purple-400 opacity-75 shadow-lg" 
                                    />
                                ) : user?.avatar ? (
                                    <img 
                                        src={user.avatar?.startsWith('http') ? user.avatar : `${API_URL}/images/${user.avatar}`} 
                                        alt="Avatar" 
                                        className="h-32 w-32 rounded-full object-cover border-4 border-transparent group-hover:border-purple-100 transition-all duration-300" 
                                    />
                                ) : (
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-32 w-32 rounded-full flex items-center justify-center text-gray-400 border-4 border-transparent shadow-inner">
                                        <FaUser size={60} />
                                    </div>
                                )}
                                <button 
                                    onClick={() => fileInputRef.current.click()} 
                                    className="absolute bottom-1.5 right-1.5 bg-purple-600 text-white p-2.5 rounded-full shadow-lg hover:bg-purple-700 transition-all transform hover:scale-110 active:scale-95 z-10 border-2 border-white"
                                    title="Change Profile Picture"
                                >
                                    <FaCamera size={16} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.fullName || user?.username}</h1>
                                <div className="space-y-1 mt-1">
                                    <p className="text-gray-500 flex items-center text-sm">
                                        <FaUser className="mr-2 text-gray-400" /> @{user?.username}
                                    </p>
                                    <p className="text-gray-500 flex items-center text-sm">
                                        <FaEnvelope className="mr-2 text-gray-400" /> {user?.email}
                                    </p>
                                    {user?.phoneNumber && (
                                        <p className="text-gray-500 flex items-center text-sm">
                                            <FaPlus className="mr-2 text-gray-400" /> {user?.phoneNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {user?.roles?.map((role, idx) => {
                                    const roleName = typeof role === 'string' ? role : role.roleName;
                                    return (
                                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center capitalize">
                                        <FaShieldAlt className="mr-1" /> {roleName?.replace('ROLE_', '').toLowerCase()}
                                    </span>
                                    );
                                })}
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
                                <button 
                                    onClick={() => { setSelectedAddress(null); setOpenAddressModal(true); }}
                                    className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center"
                                >
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
                                <button onClick={() => setOpenChangePasswordModal(true)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition active:bg-gray-100">
                                    Change Password
                                </button>
                                <button onClick={() => setOpenEmailModal(true)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition active:bg-gray-100">
                                    Email Preferences
                                </button>
                                {user?.deactivationRequested ? (
                                    <button disabled className="w-full text-left px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-medium transition cursor-not-allowed opacity-80 border border-orange-100">
                                        Deactivation Pending Approval
                                    </button>
                                ) : (
                                    <button onClick={handleDeactivationRequest} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition active:bg-red-100">
                                        Deactivate Account
                                    </button>
                                )}
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-scale-up">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input type="text" value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value={editData.fullName} onChange={e => setEditData({...editData, fullName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" placeholder="Enter your full name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="text" value={editData.phoneNumber} onChange={e => setEditData({...editData, phoneNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" placeholder="Enter phone number" />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-md shadow-purple-200">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
                <AddAddressForm address={selectedAddress} setOpenAddressModal={setOpenAddressModal} />
            </AddressInfoModal>

            <ChangePasswordModal open={openChangePasswordModal} setOpen={setOpenChangePasswordModal} />
            <EmailPreferencesModal open={openEmailModal} setOpen={setOpenEmailModal} />
        </div>
    );
};

export default Profile;
