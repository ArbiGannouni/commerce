import { useState, useEffect } from 'react';
import api from '../../config/api.js';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        { value: 'on-the-way', label: 'On the Way', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        { value: 'canceled', label: 'Canceled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/all');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
            alert('Order status updated successfully!');
        } catch (error) {
            alert('Error updating order status');
        }
    };

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch =
            order.id.toString().includes(searchQuery) ||
            order.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getOrderTotal = (order) => {
        return order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.total || 0;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-zinc-600 dark:text-zinc-400">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Orders Management</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">View and manage all customer orders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Total Orders</div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{orders.length}</div>
                    </div>
                    {statusOptions.map(status => (
                        <div key={status.value} className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">{status.label}</div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                {orders.filter(o => o.status === status.value).length}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by Order ID, Email, or Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        >
                            <option value="all">All Status</option>
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">#{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-zinc-900 dark:text-zinc-50">{order.user_name || 'Guest'}</div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">{order.user_email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                    ${getOrderTotal(order).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-primary hover:text-primary/80 font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Order #{selectedOrder.id}</h2>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        {new Date(selectedOrder.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Customer Information</h3>
                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Name:</span>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-50">{selectedOrder.user_name || 'Guest'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Email:</span>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-50">{selectedOrder.user_email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Order Status</h3>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</div>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-zinc-900 dark:text-zinc-50">${(item.price * item.quantity).toFixed(2)}</div>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400">${item.price} each</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    <span>Total:</span>
                                    <span>${getOrderTotal(selectedOrder).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
