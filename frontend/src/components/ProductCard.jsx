import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const ProductCard = ({ product }) => {
    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // Silently do nothing if not authenticated
            return;
        }

        const result = await addToCart(product.id, 1);
        // Silently handle success/error
    };

    return (
        <Link to={`/products/${product.id}`} className="flex flex-col gap-4 rounded-xl group">
            <div className="overflow-hidden rounded-lg">
                <div
                    className="bg-cover bg-center aspect-square w-full transition-transform duration-300 group-hover:scale-105"
                    style={{
                        backgroundImage: `url(${product.image || 'https://via.placeholder.com/400'})`
                    }}
                ></div>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-zinc-800 dark:text-zinc-200 text-base font-semibold leading-normal line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-normal">
                    ${product.price.toFixed(2)}
                </p>
                {product.stock < 10 && product.stock > 0 && (
                    <p className="text-orange-500 text-xs">Only {product.stock} left!</p>
                )}
                {product.stock === 0 && (
                    <p className="text-red-500 text-xs font-bold">Out of Stock</p>
                )}
            </div>
            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary text-sm font-bold leading-normal hover:bg-primary/30 dark:hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </Link>
    );
};

export default ProductCard;
