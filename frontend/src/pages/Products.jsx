import { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Products = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const filters = {};
        if (searchTerm) filters.search = searchTerm;
        if (category) filters.category = category;
        fetchProducts(filters);
    }, [searchTerm, category, fetchProducts]);

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-6">
                    All Products
                </h1>

                {/* Filters */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Home">Home</option>
                        <option value="Sports">Sports</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-zinc-600 dark:text-zinc-400">Loading products...</div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-600 dark:text-zinc-400">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Products;
