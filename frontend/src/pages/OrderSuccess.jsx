import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!order) {
        return <div className="min-h-screen flex items-center justify-center">Order not found</div>;
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Header />

            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="mx-auto max-w-4xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                            Thank you for your order!
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-lg">
                            Your order has been placed successfully. A confirmation has been sent to your email.
                        </p>

                        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 w-full max-w-md">
                            <p className="text-sm text-zinc-500">Your Order Number:</p>
                            <p className="text-2xl font-bold text-primary">#{order.id}</p>
                        </div>
                    </div>

                    <div className="mt-12 bg-white dark:bg-zinc-900 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-2">
                                    <div
                                        className="size-16 bg-cover bg-center rounded-lg shrink-0"
                                        style={{ backgroundImage: `url(${item.image || 'https://via.placeholder.com/100'})` }}
                                    ></div>
                                    <div className="flex-grow">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderSuccess;
