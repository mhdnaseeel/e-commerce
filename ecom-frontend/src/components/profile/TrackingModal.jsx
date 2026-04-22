import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaCheckCircle, FaCircle, FaShippingFast, FaBoxOpen, FaClipboardCheck, FaInfoCircle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const TrackingModal = ({ open, setOpen, order }) => {
    if (!order) return null;

    const steps = [
        { status: 'Pending', icon: FaClipboardCheck, label: 'Order Placed' },
        { status: 'Accepted', icon: FaCheckCircle, label: 'Payment Confirmed' },
        { status: 'Shipped', icon: FaShippingFast, label: 'In Transit' },
        { status: 'Delivered', icon: FaBoxOpen, label: 'Delivered' }
    ];

    const currentStatus = order.orderStatus?.toLowerCase() || 'pending';
    
    // Find index of current status
    let currentStepIndex = steps.findIndex(step => step.status.toLowerCase() === currentStatus);
    if (currentStepIndex === -1 && currentStatus === 'cancelled') currentStepIndex = -1;

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/40 transition-opacity" />
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <DialogTitle as="h3" className="text-2xl font-bold text-gray-900">
                                Track Your Order
                            </DialogTitle>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                                <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                    <FaBoxOpen size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Order Number</p>
                                    <p className="text-lg font-bold text-gray-900">#ORD-{order.orderId}</p>
                                </div>
                            </div>

                            <div className="relative">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const Icon = step.icon;

                                    return (
                                        <div key={index} className="flex gap-4 relative pb-10 last:pb-0">
                                            {/* Line */}
                                            {index < steps.length - 1 && (
                                                <div className={`absolute left-5 top-10 w-0.5 h-full ${index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'}`} />
                                            )}
                                            
                                            {/* Node */}
                                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-500 ${
                                                isCompleted ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                                <Icon size={18} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col justify-center">
                                                <p className={`font-bold transition-colors duration-500 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-sm text-purple-600 font-semibold animate-pulse">Current Status</p>
                                                )}
                                                {isCompleted && !isCurrent && (
                                                    <p className="text-sm text-gray-400 font-medium tracking-tight">Completed</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tracking Details from Admin */}
                            {order.trackingDetails && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                                        <div>
                                            <p className="text-sm font-bold text-blue-800 mb-1">Tracking Information</p>
                                            <p className="text-sm text-blue-700 whitespace-pre-line">{order.trackingDetails}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
                        >
                            Got it
                        </button>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default TrackingModal;
