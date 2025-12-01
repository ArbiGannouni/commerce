import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api.js';
import useProductStore from '../store/productStore';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ComponentRenderer from './admin/ComponentRenderer';

const Home = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [pageComponents, setPageComponents] = useState(null);
    const [loadingLayout, setLoadingLayout] = useState(true);

    useEffect(() => {
        fetchProducts();
        loadPageLayout();
    }, [fetchProducts]);

    const loadPageLayout = async () => {
        try {
            const response = await api.get('/page-builder/home');
            if (response.data.layout_data && response.data.layout_data.length > 0) {
                setPageComponents(response.data.layout_data);
            }
        } catch (error) {
            console.log('No custom layout found, using default');
        } finally {
            setLoadingLayout(false);
        }
    };

    const featuredProducts = products.slice(0, 4);

    // If custom layout exists, render it
    if (!loadingLayout && pageComponents && pageComponents.length > 0) {
        return (
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <Header />
                <main>
                    {pageComponents.map((component) => (
                        <ComponentRenderer key={component.id} component={component} />
                    ))}
                </main>
                <Footer />
            </div>
        );
    }

    // Default Home page design
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="flex flex-col items-center py-5">
                <div className="layout-content-container flex flex-col max-w-7xl flex-1 px-4 sm:px-10 w-full">
                    {/* Hero Section */}
                    <section className="w-full @container">
                        <div className="@[480px]:p-4">
                            <div
                                className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-center justify-center p-4"
                                style={{
                                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')"
                                }}
                            >
                                <div className="flex flex-col gap-2 text-center max-w-2xl">
                                    <h1 className="text-white text-4xl font-black leading-tight tracking-tighter @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-tighter">
                                        Summer Collection is Here
                                    </h1>
                                    <h2 className="text-white/90 text-sm font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
                                        Discover the latest trends and styles for the season. Fresh looks, bright colors, and unbeatable prices.
                                    </h2>
                                </div>
                                <Link
                                    to="/products"
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-zinc-900 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors"
                                >
                                    <span className="truncate">Shop Now</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section className="w-full">
                        <h2 className="text-zinc-900 dark:text-zinc-50 text-[22px] font-bold leading-tight tracking-tight px-4 pb-3 pt-10">
                            Shop by Category
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
                            {['Electronics', 'Apparel', 'Home', 'Sports'].map((category) => (
                                <Link
                                    key={category}
                                    to={`/products?category=${category}`}
                                    className="relative bg-cover bg-center flex flex-col rounded-xl justify-end p-4 aspect-square group overflow-hidden"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400')`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                                        style={{
                                            backgroundImage: `url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400')`
                                        }}
                                    ></div>
                                    <p className="text-white text-base font-bold leading-tight line-clamp-2 z-10">
                                        {category}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Featured Products */}
                    <section className="w-full">
                        <h2 className="text-zinc-900 dark:text-zinc-50 text-[22px] font-bold leading-tight tracking-tight px-4 pb-3 pt-10">
                            Our Featured Picks
                        </h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-zinc-600 dark:text-zinc-400">Loading products...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </section>

                    {!loading && featuredProducts.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <Link
                                to="/products"
                                className="flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                View All Products
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
