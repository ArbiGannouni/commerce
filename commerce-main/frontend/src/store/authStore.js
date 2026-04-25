import { create } from 'zustand';
import api from '../config/api.js';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    // Set auth token in localStorage
    setAuthToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },

    // Register
    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;

            set((state) => {
                state.setAuthToken(token);
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
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            set((state) => {
                state.setAuthToken(token);
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
            state.setAuthToken(null);
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
            state.setAuthToken(token);
            return { loading: true };
        });

        try {
            const response = await api.get('/auth/me');
            set({ user: response.data.user, isAuthenticated: true, loading: false });
        } catch (error) {
            set((state) => {
                state.setAuthToken(null);
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
