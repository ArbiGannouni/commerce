import { useState, useEffect } from 'react';
import api from '../../config/api.js';
import Header from '../../components/Header';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/all');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            fetchUsers(); // Refresh the list
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating user role');
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${userId}`);
            fetchUsers(); // Refresh the list
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting user');
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'manager':
            case 'lowadmin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'manager':
            case 'lowadmin':
                return 'Manager';
            default:
                return 'Customer';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex items-center justify-center flex-1">
                    <div className="text-xl text-zinc-600 dark:text-zinc-400">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">User Management</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Manage user roles and permissions</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Total Users</div>
                            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{users.length}</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Admins</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {users.filter(u => u.role === 'admin').length}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Managers</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {users.filter(u => u.role === 'lowadmin' || u.role === 'manager').length}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-1">Customers</div>
                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                {users.filter(u => u.role === 'customer').length}
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer border-0 ${getRoleBadgeClass(user.role)}`}
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Permissions Info */}
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-50 mb-4">Role Permissions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-gray-50 mb-2">Customer</div>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>✓ Shopping</li>
                                    <li>✓ View own orders</li>
                                    <li>✓ Manage cart</li>
                                </ul>
                            </div>
                            <div>
                                <div className="font-semibold text-blue-900 dark:text-blue-50 mb-2">Manager</div>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>✓ Everything Customer can do</li>
                                    <li>✓ Manage Products</li>
                                    <li>✓ Manage Orders</li>
                                    <li>✗ NO Settings</li>
                                    <li>✗ NO Page Builder</li>
                                    <li>✗ NO User Management</li>
                                </ul>
                            </div>
                            <div>
                                <div className="font-semibold text-purple-900 dark:text-purple-50 mb-2">Admin</div>
                                <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                                    <li>✓ Everything Low Admin can do</li>
                                    <li>✓ Page Builder</li>
                                    <li>✓ Component Library</li>
                                    <li>✓ User Management</li>
                                    <li>✓ Full Access</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
