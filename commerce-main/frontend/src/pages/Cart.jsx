import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { cartItems, fetchCart, updateCartItem, removeFromCart, getCartTotal, loading } = useCartStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(cartItemId, newQuantity);
    };

    const handleRemove = async (cartItemId) => {
        if (confirm('Remove this item from cart?')) {
            await removeFromCart(cartItemId);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login to view your cart</p>
            </div>
        );
    }

    const total = getCartTotal();
    const shipping = 5.00;
    const tax = total * 0.081;
    const grandTotal = total + shipping + tax;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-8">
                    Your Cart ({cartItems.length} Items)
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading cart...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">Your cart is empty</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 bg-white dark:bg-background-dark/50 p-4 justify-between rounded-xl shadow-sm"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] sm:size-[90px]"
                                            style={{ backgroundImage: `url(${item.image || 'https://via.placeholder.com/100'})` }}
                                        ></div>
                                        <div className="flex flex-1 flex-col justify-center gap-1">
                                            <p className="text-zinc-900 dark:text-zinc-50 text-base font-medium">{item.name}</p>
                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between shrink-0">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="text-xs font-medium text-red-500 hover:text-red-700 mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <aside className="lg:col-span-1 w-full lg:sticky top-24">
                            <div className="bg-white dark:bg-background-dark/50 p-6 rounded-xl shadow-sm flex flex-col gap-6">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Order Summary</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between">
                                        <p className="text-zinc-600 dark:text-zinc-400">Subtotal</p>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">${total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-zinc-600 dark:text-zinc-400">Shipping</p>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">${shipping.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-zinc-600 dark:text-zinc-400">Tax</p>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">${tax.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700"></div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold">Total</p>
                                    <p className="text-2xl font-black">${grandTotal.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
