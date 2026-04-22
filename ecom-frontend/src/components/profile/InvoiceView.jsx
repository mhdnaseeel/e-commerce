import React from 'react';
import { FaBox, FaGlobe, FaReceipt, FaCreditCard, FaTruck } from 'react-icons/fa';

const InvoiceView = ({ order }) => {
    if (!order) return null;

    const BACKEND_URL = import.meta.env.VITE_BACK_END_URL;

    return (
        <div id={`invoice-${order.orderId}`} className="hidden print:block p-8 bg-white text-gray-900 font-sans leading-relaxed">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b-4 border-purple-50 pb-6">
                <div>
                    <h1 className="text-5xl font-black text-purple-700 tracking-tighter flex items-center gap-3">
                        <FaReceipt className="text-purple-600" size={40} /> E-SHOP
                    </h1>
                    <div className="mt-4 space-y-1">
                        <p className="text-gray-400 text-xs uppercase font-black tracking-widest leading-none">Official Digital Invoice</p>
                        <p className="text-gray-500 text-sm font-medium">customer-support@eshop.com</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400 uppercase font-black tracking-widest mb-1">Invoice Number</p>
                    <p className="text-3xl font-black text-gray-900 mb-2 tracking-tight">#ORD-{order.orderId}</p>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg inline-block border border-gray-100">
                        <p className="text-sm font-bold text-gray-600">{order.orderDate}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-6">
                <div>
                    <h2 className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em] mb-4">Billed To</h2>
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <p className="font-black text-2xl text-gray-900 leading-tight mb-2">
                            {order.address?.firstName ? `${order.address.firstName} ${order.address.lastName}` : order.email}
                        </p>
                        <p className="text-sm text-purple-600 font-bold mb-4">{order.email}</p>
                        
                        {order.address ? (
                            <div className="text-gray-500 space-y-1 text-sm font-medium">
                                <p className="text-gray-900 font-bold">{order.address.buildingName}</p>
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                <p className="pt-2 text-gray-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    <FaGlobe size={10} className="text-purple-400" /> {order.address.country}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-sm">No billing address found</p>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-[10px] uppercase font-black text-purple-400 tracking-[0.2em] mb-4">Transaction Details</h2>
                    <div className="bg-purple-600 p-6 rounded-2xl text-white shadow-lg shadow-purple-100 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                <span className="text-purple-100 text-xs font-bold uppercase flex items-center gap-2">
                                    <FaTruck size={12} /> Status
                                </span>
                                <span className="px-3 py-1 bg-white text-purple-700 text-[10px] font-black rounded-full uppercase tracking-wider">{order.orderStatus}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-purple-100 text-xs font-bold uppercase flex items-center gap-2">
                                    <FaCreditCard size={12} /> Payment
                                </span>
                                <span className="font-black text-sm">{order.payment?.paymentMethod || 'Stripe / Cards'}</span>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/20 mt-6 translate-y-2">
                            <span className="text-purple-200 text-xs font-bold uppercase block mb-1">Final Amount Billed</span>
                            <span className="text-4xl font-black tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-6">
                <div className="bg-gray-900 rounded-xl p-5 px-8 grid grid-cols-5 font-black text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-4 shadow-sm">
                    <div className="col-span-3">Item Details</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Unit Price</div>
                </div>
                <div className="space-y-4 px-2">
                    {order.orderItems.map((item, idx) => (
                        <div key={idx} className="py-4 grid grid-cols-5 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors rounded-lg px-6">
                            <div className="col-span-3 flex items-center gap-6">
                                <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                                    {item.product.image ? (
                                        <img 
                                            src={item.product.image.startsWith('http') ? item.product.image : `${BACKEND_URL}/images/${item.product.image}`}
                                            alt={item.product.productName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : <FaBox className="text-gray-300" />}
                                </div>
                                <div>
                                    <p className="font-black text-lg text-gray-900 tracking-tight">{item.product.productName}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">SKU: {item.product.productId || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="text-center font-black text-gray-600 bg-gray-100/50 w-fit mx-auto px-4 py-1 rounded-full text-sm">×{item.quantity}</div>
                            <div className="text-right font-black text-gray-900 text-lg tracking-tighter">${item.orderedProductPrice.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calculations */}
            <div className="flex justify-end pt-4">
                <div className="w-80 bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-4">
                    <div className="flex justify-between text-gray-500 font-bold text-sm">
                        <span>Invoice Subtotal</span>
                        <span className="text-gray-900 font-black">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-bold text-sm items-center">
                        <span>Handling & Shipping</span>
                        <span className="text-green-600 font-black uppercase text-[10px] bg-green-50 px-2 py-1 rounded-md">Free Delivery</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-900 px-6 py-5 rounded-2xl text-white shadow-xl shadow-gray-200 mt-6 translate-x-2">
                        <span className="font-bold text-xs uppercase tracking-widest text-gray-400">Total Billed</span>
                        <span className="text-2xl font-black tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Professional Footer */}
            <div className="mt-10 flex flex-col items-center">
                <div className="w-16 h-1 bg-purple-100 rounded-full mb-6"></div>
                <div className="text-center space-y-2">
                    <p className="text-gray-900 font-black text-base tracking-tight">Thank you for your business!</p>
                    <p className="text-[10px] text-gray-400 font-medium max-w-xs mx-auto">
                        This is an electronically generated document. If you have any questions regarding this invoice, please contact our financial department.
                    </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    <span className="w-6 h-[1px] bg-gray-100"></span>
                    ESHOP GLOBAL COMMERCE
                    <span className="w-6 h-[1px] bg-gray-100"></span>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;

