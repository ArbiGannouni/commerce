import { create } from 'zustand';
import api from '../config/api.js';

const useProductStore = create((set) => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,

    // Fetch all products
    fetchProducts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/products?${params}`);
            set({ products: response.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch products', loading: false });
        }
    },

    // Fetch single product
    fetchProduct: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/products/${id}`);
            set({ currentProduct: response.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch product', loading: false });
        }
    },

    // Create product (admin only)
    createProduct: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            set((state) => ({
                products: [response.data.product, ...state.products],
                loading: false
            }));

            return { success: true, product: response.data.product };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create product';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Update product (admin only)
    updateProduct: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? response.data.product : p
                ),
                currentProduct: response.data.product,
                loading: false
            }));

            return { success: true, product: response.data.product };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update product';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Delete product (admin only)
    deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/products/${id}`);

            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
                loading: false
            }));

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete product';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },
}));

export default useProductStore;
