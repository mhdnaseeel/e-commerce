import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { deactivationTableColumns } from '../helper/tableColumn';
import api from '../../api/api';
import toast from 'react-hot-toast';
import Loader from '../shared/Loader';
import { FaUsersSlash } from 'react-icons/fa';

const UserManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10, totalElements: 0 });

    const fetchRequests = async (page = 0) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/users/deactivation-requests?pageNumber=${page}`);
            setRequests(res.data.content);
            setPagination({
                pageNumber: res.data.pageNumber,
                pageSize: res.data.pageSize,
                totalElements: res.data.totalElements
            });
        } catch (error) {
            console.error("Deactivation requests fetch error:", error?.response?.status, error?.response?.data);
            if (error?.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error("Failed to fetch deactivation requests");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (userId, approve) => {
        const actionText = approve ? "deactivated" : "rejected";
        try {
            await api.put(`/admin/users/${userId}/deactivate?approve=${approve}`, {});
            toast.success(`User successfully ${actionText}`);
            fetchRequests(pagination.pageNumber);
        } catch (error) {
            toast.error(`Failed to ${approve ? 'deactivate' : 'reject'} user`);
        }
    };

    const rows = requests.map(req => ({
        id: req.userId,
        username: req.username,
        email: req.email
    }));

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FaUsersSlash className="mr-3 text-red-600" /> Account Deactivation Requests
                </h1>
                <p className="text-gray-500 mt-2">Manage users who have requested their accounts to be deactivated.</p>
            </div>

            {loading && !requests.length ? (
                <Loader />
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                        <FaUsersSlash className="text-gray-300 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700">No Pending Requests</h3>
                    <p className="text-gray-500 mt-1">There are currently no users requesting deactivation.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <DataGrid
                        rows={rows}
                        columns={deactivationTableColumns(handleAction)}
                        rowCount={pagination.totalElements}
                        paginationMode="server"
                        onPaginationModelChange={(model) => fetchRequests(model.page)}
                        pageSizeOptions={[10]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                        }}
                        disableRowSelectionOnClick
                        autoHeight
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f3f4f6',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f9fafb',
                                borderBottom: '1px solid #f3f4f6',
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default UserManagement;
