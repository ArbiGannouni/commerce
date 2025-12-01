import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
    cartItems: [],
    loading: false,
    error: null,

    // Fetch cart
    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/cart');
            set({ cartItems: response.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch cart', loading: false });
        }
    },

    // Add to cart
    addToCart: async (productId, quantity = 1) => {
        set({ loading: true, error: null });
        try {
            await axios.post('/api/cart', { product_id: productId, quantity });
            await get().fetchCart(); // Refresh cart
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add to cart';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Update cart item quantity
    updateCartItem: async (cartItemId, quantity) => {
        set({ loading: true, error: null });
        try {
            await axios.put(`/api/cart/${cartItemId}`, { quantity });
            await get().fetchCart(); // Refresh cart
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Remove from cart
    removeFromCart: async (cartItemId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/cart/${cartItemId}`);
            set((state) => ({
                cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove from cart';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Clear cart
    clearCart: async () => {
        set({ loading: true, error: null });
        try {
            await axios.delete('/api/cart');
            set({ cartItems: [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to clear cart', loading: false });
        }
    },

    // Get cart total
    getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get cart item count
    getCartCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    },
}));

export default useCartStore;
