import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../store/cartStore';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
    const navigate = useNavigate();
    const { getCartTotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/orders', {
                shipping_address: shippingAddress,
                payment_method: paymentMethod
            });
            await clearCart();
            navigate(`/order-success/${response.data.order.id}`);
        } catch (error) {
            // Silently handle error, keep form active for retry
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {/* Shipping Address */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-zinc-50">
                            Shipping Address *
                        </label>
                        <textarea
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            placeholder="Enter your full shipping address"
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-zinc-900 dark:text-zinc-50">
                            Payment Method *
                        </label>
                        <div className="space-y-3">
                            {/* Card Payment */}
                            <label className="flex items-center p-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-primary dark:hover:border-primary transition-colors">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">credit_card</span>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-50">Credit/Debit Card</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                        Pay securely with your card
                                    </p>
                                </div>
                            </label>

                            {/* Cash on Delivery */}
                            <label className="flex items-center p-4 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-primary dark:hover:border-primary transition-colors">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-primary"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600">local_shipping</span>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-50">Cash on Delivery</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                        Pay when you receive your order
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <span className="text-zinc-700 dark:text-zinc-300">Total Amount:</span>
                            <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                            <span>Payment:</span>
                            <span className="font-medium">
                                {paymentMethod === 'card' ? 'Card Payment' : 'Cash on Delivery'}
                            </span>
                        </div>
                        {paymentMethod === 'card' && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                                *This is a demo checkout. No real payment is processed.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Confirm Order (COD)' : 'Place Order'}
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
