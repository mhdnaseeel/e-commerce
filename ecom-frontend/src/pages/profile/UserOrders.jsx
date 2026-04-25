import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { FaBox, FaCalendarAlt, FaCheckCircle, FaClock, FaChevronRight } from 'react-icons/fa';
import TrackingModal from '../../components/profile/TrackingModal';
import InvoiceView from '../../components/profile/InvoiceView';
import ProductViewModal from '../../components/shared/ProductViewModal';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [openTracking, setOpenTracking] = useState(false);
    const [openProductView, setOpenProductView] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/users/orders`);
                setOrders(response.data.content);
            } catch (error) {
                console.error("Error fetching orders", error);
                toast.error("Failed to load order history");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleTrackOrder = (order) => {
        setSelectedOrder(order);
        setOpenTracking(true);
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setOpenProductView(true);
    };

    const handleDownloadInvoice = (order) => {
        // We use a simple window.print() of the InvoiceView which is hidden by default
        setSelectedOrder(order);
        setTimeout(() => {
            window.print();
        }, 300);
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main UI - Hidden during printing */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 print:hidden">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                            <p className="text-gray-500 mt-1">Check the status of current and past orders</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-40 bg-white rounded-2xl animate-pulse shadow-sm"></div>
                            ))}
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
                                                    <p className="font-mono text-gray-800">#ORD-{order.orderId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Date</p>
                                                    <p className="text-gray-800 flex items-center font-medium">
                                                        <FaCalendarAlt className="mr-2 text-gray-400" /> {order.orderDate}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                                                    <p className="text-gray-900 font-bold">${order.totalAmount.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold flex items-center ${getStatusStyle(order.orderStatus)}`}>
                                                {order.orderStatus === 'Delivered' ? <FaCheckCircle className="mr-2" /> : <FaClock className="mr-2" />}
                                                {order.orderStatus}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-50 pt-6">
                                            <div className="flex flex-col gap-4">
                                                {order.orderItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                                {item.product.image ? (
                                                                    <img 
                                                                        src={item.product.image.startsWith('http') ? item.product.image : `${import.meta.env.VITE_BACK_END_URL}/images/${item.product.image}`}
                                                                        alt={item.product.productName}
                                                                        className="h-full w-full object-cover rounded-lg"
                                                                    />
                                                                ) : <FaBox size={24} />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{item.product.productName}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.orderedProductPrice.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleViewProduct({
                                                                ...item.product,
                                                                price: item.orderedProductPrice,
                                                                specialPrice: item.orderedProductPrice
                                                            })}
                                                            className="text-purple-600 hover:text-purple-700 font-bold text-sm flex items-center bg-purple-50 px-3 py-2 rounded-lg transition"
                                                        >
                                                            View Product <FaChevronRight className="ml-1" size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleDownloadInvoice(order)}
                                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-white rounded-lg transition border border-gray-200"
                                        >
                                            Download Invoice
                                        </button>
                                        <button 
                                            onClick={() => handleTrackOrder(order)}
                                            className="px-4 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-sm"
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                            <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-6">
                                <FaBox size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-8 px-8">Looks like you haven't placed any orders yet. Start shopping to find the best deals!</p>
                            <a href="/products" className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition duration-300 shadow-lg inline-block text-center">
                                Start Shopping
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals and Overlays */}
            <TrackingModal 
                open={openTracking} 
                setOpen={setOpenTracking} 
                order={selectedOrder} 
            />
            
            <ProductViewModal 
                open={openProductView} 
                setOpen={setOpenProductView} 
                product={selectedProduct}
                isAvailable={true}
            />

            {/* Print Section - Only visible during printing */}
            <div id="invoice-root" className="hidden print:block">
                {selectedOrder && <InvoiceView order={selectedOrder} />}
            </div>

            <style>
                {`
                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body {
                            background: white;
                            margin: 0;
                            padding: 0;
                        }
                        #invoice-root {
                            display: block !important;
                            position: static !important;
                            width: 100%;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default UserOrders;
