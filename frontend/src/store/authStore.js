import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    // Set auth header for axios
    setAuthHeader: (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    },

    // Register
    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/api/auth/register', userData);
            const { token, user } = response.data;

            set((state) => {
                state.setAuthHeader(token);
                return {
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false
                };
            });

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Login
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/api/auth/login', credentials);
            const { token, user } = response.data;

            set((state) => {
                state.setAuthHeader(token);
                return {
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false
                };
            });

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Logout
    logout: () => {
        set((state) => {
            state.setAuthHeader(null);
            return {
                user: null,
                token: null,
                isAuthenticated: false,
                error: null
            };
        });
    },

    // Get current user
    fetchUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set((state) => {
            state.setAuthHeader(token);
            return { loading: true };
        });

        try {
            const response = await axios.get('/api/auth/me');
            set({ user: response.data.user, isAuthenticated: true, loading: false });
        } catch (error) {
            set((state) => {
                state.setAuthHeader(null);
                return {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false
                };
            });
        }
    },
}));

export default useAuthStore;
