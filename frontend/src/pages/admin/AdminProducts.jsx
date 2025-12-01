import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useAuthStore from '../../store/authStore';
import Header from '../../components/Header';

const AdminProducts = () => {
    const { products, fetchProducts, deleteProduct, createProduct, updateProduct } = useProductStore();
    const { user } = useAuthStore();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Electronics'
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);
        if (imageFile) {
            data.append('image', imageFile);
        }

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, data);
        } else {
            result = await createProduct(data);
        }

        if (result.success) {
            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '', category: 'Electronics' });
            setImageFile(null);
            alert(editingProduct ? 'Product updated!' : 'Product created!');
            await fetchProducts();
        } else {
            alert(result.error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category || 'Electronics'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            const result = await deleteProduct(id);
            if (result.success) {
                alert('Product deleted!');
                await fetchProducts();
            } else {
                alert(result.error || 'Failed to delete product');
            }
        }
    };

    // Allow managers, admins, and superadmins
    if (!['admin', 'superadmin', 'manager', 'lowadmin'].includes(user?.role)) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50">Product Management</h1>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingProduct(null);
                            setFormData({ name: '', description: '', price: '', stock: '', category: 'Electronics' });
                        }}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
                    >
                        {showForm ? 'Cancel' : 'Add Product'}
                    </button>
                </div>

                {/* Product Form */}
                {showForm && (
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl mb-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                    >
                                        <option>Electronics</option>
                                        <option>Apparel</option>
                                        <option>Home</option>
                                        <option>Sports</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90"
                            >
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-100 dark:bg-zinc-800">
                            <tr>
                                <th className="px-4 py-3 text-left">Image</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-zinc-200 dark:border-zinc-800">
                                    <td className="px-4 py-3">
                                        <div
                                            className="size-12 bg-cover bg-center rounded"
                                            style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/50'})` }}
                                        ></div>
                                    </td>
                                    <td className="px-4 py-3">{product.name}</td>
                                    <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                                    <td className="px-4 py-3">{product.stock}</td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-primary mr-3 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminProducts;
