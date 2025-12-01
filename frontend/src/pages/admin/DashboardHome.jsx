import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useProductStore from '../../store/productStore';
import Header from '../../components/Header';

const DashboardHome = () => {
    const { products } = useProductStore();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        lowStockProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentOrders();
    }, []);

    const fetchStats = async () => {
        try {
            const ordersRes = await axios.get('/api/orders/admin/all');
            const orders = ordersRes.data;

            const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
            const customers = new Set(orders.map(order => order.user_id)).size;
            const lowStock = products.filter(p => p.stock < 10).length;

            setStats({
                totalOrders: orders.length,
                totalRevenue,
                totalCustomers: customers,
                lowStockProducts: lowStock
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await axios.get('/api/orders/admin/all');
            setRecentOrders(response.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">Admin Dashboard</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">Welcome back! Here's what's happening with your store.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Orders</p>
                                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.totalOrders}</p>
                            </div>
                            <div className="size-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Revenue</p>
                                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">${stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="size-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500 text-2xl">monetization_on</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Products</p>
                                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{products.length}</p>
                            </div>
                            <div className="size-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-500 text-2xl">inventory_2</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Low Stock Items</p>
                                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.lowStockProducts}</p>
                            </div>
                            <div className="size-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-500 text-2xl">warning</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link to="/admin/products" className="bg-gradient-to-br from-primary to-orange-600 p-6 rounded-xl text-white hover:shadow-lg transition-shadow">
                        <span className="material-symbols-outlined text-4xl mb-2">inventory</span>
                        <h3 className="text-xl font-bold">Manage Products</h3>
                        <p className="text-white/80 text-sm mt-1">Add, edit, or remove products</p>
                    </Link>

                    <Link to="/admin/orders" className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white hover:shadow-lg transition-shadow">
                        <span className="material-symbols-outlined text-4xl mb-2">list_alt</span>
                        <h3 className="text-xl font-bold">View Orders</h3>
                        <p className="text-white/80 text-sm mt-1">Manage customer orders</p>
                    </Link>

                    <Link to="/admin/users" className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white hover:shadow-lg transition-shadow">
                        <span className="material-symbols-outlined text-4xl mb-2">group</span>
                        <h3 className="text-xl font-bold">User Management</h3>
                        <p className="text-white/80 text-sm mt-1">Manage users and roles</p>
                    </Link>

                    <Link to="/products" className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl text-white hover:shadow-lg transition-shadow">
                        <span className="material-symbols-outlined text-4xl mb-2">storefront</span>
                        <h3 className="text-xl font-bold">View Store</h3>
                        <p className="text-white/80 text-sm mt-1">See customer view</p>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-100 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-600 dark:text-zinc-400">
                                            No orders yet
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-zinc-200 dark:border-zinc-800">
                                            <td className="px-6 py-4">#{order.id}</td>
                                            <td className="px-6 py-4">{order.customer_name}</td>
                                            <td className="px-6 py-4">${order.total_amount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded text-xs font-medium">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {recentOrders.length > 0 && (
                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                            <Link to="/admin/orders" className="text-primary hover:text-primary/80 font-medium text-sm">
                                View all orders →
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardHome;
