import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, adminOnly = false, managerAllowed = false }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if this route requires admin-only access (settings, page builder, user management)
    if (adminOnly && !['admin', 'superadmin'].includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    // Check if this route allows managers (products, orders, dashboard)
    if (managerAllowed && !['admin', 'superadmin', 'manager', 'lowadmin'].includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
