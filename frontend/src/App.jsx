import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import DashboardHome from './pages/admin/DashboardHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import PageBuilder from './pages/admin/PageBuilder';
import RenderPage from './pages/RenderPage';
import SiteSettings from './pages/admin/SiteSettings';
import UserManagement from './pages/admin/UserManagement';

function App() {
    const { fetchUser, isAuthenticated } = useAuthStore();
    const { fetchCart } = useCartStore();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order-success/:orderId"
                    element={
                        <ProtectedRoute>
                            <OrderSuccess />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute managerAllowed>
                            <DashboardHome />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute managerAllowed>
                            <AdminProducts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute managerAllowed>
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/page-builder"
                    element={
                        <ProtectedRoute adminOnly>
                            <PageBuilder />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute adminOnly>
                            <SiteSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute adminOnly>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route path="/page/:pageName" element={<RenderPage />} />
            </Routes>
        </Router>
    );
}

export default App;
