import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

const Header = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { cartItems } = useCartStore(); // Subscribe to cartItems instead of getCartCount
    const [siteSettings, setSiteSettings] = useState({
        siteName: 'E-Commerce',
        logoUrl: '',
        primaryColor: '#f47b25'
    });
    const [pages, setPages] = useState([]);

    // Calculate cart count reactively
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        loadSettings();
        loadPages();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await axios.get('/api/settings');
            setSiteSettings({
                siteName: response.data.siteName || 'E-Commerce',
                logoUrl: response.data.logoUrl || '',
                primaryColor: response.data.primaryColor || '#f47b25'
            });
        } catch (error) {
            console.log('Using default settings');
        }
    };

    const loadPages = async () => {
        try {
            const response = await axios.get('/api/builder/pages');
            setPages(response.data.filter(p => p.page_name !== 'home'));
        } catch (error) {
            console.log('No pages found');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 flex justify-center border-b border-solid border-b-black/10 dark:border-b-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-3 max-w-7xl w-full">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
                        {siteSettings.logoUrl ? (
                            <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-8 object-contain" />
                        ) : (
                            <div className="size-6" style={{ color: siteSettings.primaryColor }}>
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                                </svg>
                            </div>
                        )}
                        <h2 className="text-zinc-900 dark:text-zinc-50 text-xl font-bold leading-tight tracking-tight">
                            {siteSettings.siteName}
                        </h2>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-9">
                        <Link
                            className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                            to="/"
                        >
                            Home
                        </Link>
                        <Link
                            className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                            to="/products"
                        >
                            Shop
                        </Link>
                        {/* Dynamic Pages */}
                        {pages.map((page) => (
                            <Link
                                key={page.page_name}
                                className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors capitalize"
                                to={`/page/${page.page_name}`}
                            >
                                {page.page_name.replace(/-/g, ' ')}
                            </Link>
                        ))}
                        {/* Admin Links */}
                        {isAuthenticated && ['admin', 'superadmin', 'manager', 'lowadmin'].includes(user?.role) && (
                            <>
                                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
                                <Link
                                    className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                                    to="/admin"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                                    to="/admin/products"
                                >
                                    Products
                                </Link>
                                <Link
                                    className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                                    to="/admin/orders"
                                >
                                    Orders
                                </Link>
                                {/* Admin-only links (not for managers) */}
                                {['admin', 'superadmin'].includes(user?.role) && (
                                    <>
                                        <Link
                                            className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                                            to="/admin/page-builder"
                                        >
                                            Page Builder
                                        </Link>
                                        <Link
                                            className="text-zinc-800 dark:text-zinc-200 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
                                            to="/admin/settings"
                                        >
                                            Settings
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </nav>
                </div>
                <div className="flex flex-1 justify-end items-center gap-3 sm:gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/cart"
                                className="relative flex items-center justify-center h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-primary dark:hover:text-primary transition-all duration-200 hover:scale-105"
                            >
                                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                                {cartCount > 0 && (
                                    <div
                                        className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-xs font-bold shadow-lg ring-2 ring-white dark:ring-zinc-900"
                                        style={{ backgroundColor: siteSettings.primaryColor }}
                                    >
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </div>
                                )}
                            </Link>
                            <div className="flex items-center gap-3">
                                <span className="hidden md:block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    {user?.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-105"
                                    title="Logout"
                                >
                                    <span className="material-symbols-outlined text-2xl">logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 h-10 px-6 rounded-full text-white text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            style={{ backgroundColor: siteSettings.primaryColor }}
                        >
                            <span className="material-symbols-outlined text-xl">login</span>
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
