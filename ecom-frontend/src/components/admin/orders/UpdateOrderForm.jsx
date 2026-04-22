import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { FaSpinner } from 'react-icons/fa';
import Spinners from '../../shared/Spinners';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatusFromDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';

const ORDER_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Accepted",
];

const UpdateOrderForm = ({ setOpen, selectedId, selectedItem, loader, setLoader}) => {
    const [orderStatus, setOrderStatus] = useState(selectedItem?.status || 'Accepted');
    const [trackingDetails, setTrackingDetails] = useState(selectedItem?.trackingDetails || '');
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

    const updateOrderStatus = (e) => {
        e.preventDefault();
        if (!orderStatus) {
            setError("Order status is required");
            return;
        }
        dispatch(updateOrderStatusFromDashboard(
            selectedId,
            orderStatus,
            trackingDetails,
            toast,
            setLoader,
            isAdmin
        ));
    };

  return (
    <div className='py-5 relative h-full'>
        <form className='space-y-4' onSubmit={updateOrderStatus}>
            <FormControl fullWidth variant='outlined' error={!!error}>
                <InputLabel id="order-status-label">Order Status</InputLabel>
                <Select
                    labelId='order-status-label'
                    label='Order Status'
                    value={orderStatus}
                    onChange={(e) => {
                        setOrderStatus(e.target.value);
                        setError("");
                    }}>
                    
                    {
                        ORDER_STATUSES.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))
                    }

                </Select>

                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            <TextField
                fullWidth
                multiline
                rows={3}
                variant='outlined'
                label='Tracking Details'
                placeholder='e.g. Shipped via FedEx, Tracking ID: 123456789'
                value={trackingDetails}
                onChange={(e) => setTrackingDetails(e.target.value)}
                helperText='This information will be visible to the customer in "Track Your Order"'
            />

            <div className='flex w-full justify-between items-center absolute bottom-14'>
                <Button disabled={loader}
                        onClick={() => setOpen(false)}
                        variant='outlined'
                        className='text-white py-[10px] px-4 text-sm font-medium'>
                    Cancel
                </Button>

                <Button
                    disabled={loader}
                    type='submit'
                    variant='contained'
                    color='primary'
                    className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                    {loader ? (
                        <div className='flex gap-2 items-center'>
                            <Spinners /> Loading...
                        </div>
                    ) : (
                        "Update"
                    )}
                </Button>
            </div>
        </form>

    </div>
  )
}

export default UpdateOrderForm