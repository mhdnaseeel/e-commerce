import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector, useDispatch } from 'react-redux';
import { Backdrop, CircularProgress, Alert, AlertTitle } from '@mui/material';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaypalPayment = () => {
    const { totalPrice } = useSelector((state) => state.carts);
    const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    const createOrder = async () => {
        try {
            const { data } = await api.post("/paypal/create-order", {
                amount: totalPrice
            });
            return data.id;
        } catch (error) {
            console.error(error);
            toast.error("Failed to initiate PayPal order");
        }
    };

    const onApprove = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/paypal/capture-order", {
                orderId: data.orderID
            });
            
            if (response.status === 200) {
                // Confirm the order on our backend
                const sendData = {
                    addressId: selectedUserCheckoutAddress.addressId,
                    pgName: "PayPal",
                    pgPaymentId: data.orderID,
                    pgStatus: "succeeded",
                    pgResponseMessage: "Payment successful via PayPal"
                }

                await api.post("/order/users/payments/paypal", sendData);

                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("cartItems");
                dispatch({ type: "REMOVE_CHECKOUT_ADDRESS"});
                dispatch({ type: "CLEAR_CART"});
                
                toast.success("Order Placed Successfully!");
                navigate("/order-confirmation");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to capture PayPal payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[400px] flex flex-col justify-center items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-inner'>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Complete Payment</h2>
                    <p className="text-slate-500">Pay securely with PayPal</p>
                </div>

                <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons 
                        style={{ layout: "vertical", shape: "pill" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                            console.error(err);
                            toast.error("PayPal checkout error occurred");
                        }}
                    />
                </PayPalScriptProvider>

                <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
                    <span className="text-sm text-blue-600 font-medium">Total Amount: ${totalPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default PaypalPayment;