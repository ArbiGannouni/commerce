import { useEffect, useState } from 'react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/ProductCard';

const ComponentRenderer = ({ component }) => {
    const { products, fetchProducts } = useProductStore();
    const { type, props } = component;

    useEffect(() => {
        if ((type === 'productGrid' || type === 'productShowcase') && products.length === 0) {
            fetchProducts();
        }
    }, [type, products.length, fetchProducts]);

    // Helper function to get spacing styles
    const getSpacingStyles = () => {
        return {
            paddingTop: props.paddingTop || '0',
            paddingBottom: props.paddingBottom || '0',
            paddingLeft: props.paddingLeft || '0',
            paddingRight: props.paddingRight || '0',
            marginTop: props.marginTop || '0',
            marginBottom: props.marginBottom || '0',
        };
    };

    const spacingStyles = getSpacingStyles();

    switch (type) {
        case 'hero':
            return (
                <div
                    className="relative bg-cover bg-center flex items-center justify-center"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${props.backgroundImage})`,
                        minHeight: '24rem',
                        ...spacingStyles
                    }}
                >
                    <div className="relative text-white text-center z-10 px-4 max-w-4xl">
                        <h1 className="text-5xl font-bold mb-4">{props.title}</h1>
                        <p className="text-xl mb-6">{props.subtitle}</p>
                        <button className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-lg font-bold transition-colors">
                            {props.buttonText}
                        </button>
                    </div>
                </div>
            );

        case 'text':
            return (
                <div
                    style={{ textAlign: props.alignment, fontSize: props.fontSize, ...spacingStyles }}
                >
                    <p className="text-zinc-900 dark:text-zinc-50 px-8 py-4">{props.content}</p>
                </div>
            );

        case 'image':
            return (
                <div style={spacingStyles}>
                    <div className="px-4">
                        <img
                            src={props.src}
                            alt={props.alt}
                            className="w-full rounded-lg object-cover"
                            style={{ maxHeight: '500px' }}
                        />
                    </div>
                </div>
            );

        case 'banner':
            return (
                <div
                    className="text-center text-2xl font-bold py-8 px-4"
                    style={{
                        backgroundColor: props.backgroundColor,
                        color: props.textColor,
                        ...spacingStyles
                    }}
                >
                    {props.text}
                </div>
            );

        case 'video':
            // Helper function to get position styles
            const getPositionStyle = (position) => {
                const positions = {
                    'top-left': { top: '1rem', left: '1rem' },
                    'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
                    'top-right': { top: '1rem', right: '1rem' },
                    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
                    'bottom-left': { bottom: '1rem', left: '1rem' },
                    'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
                    'bottom-right': { bottom: '1rem', right: '1rem' },
                };
                return positions[position] || positions.center;
            };

            const videoSrc = props.videoType === 'upload' && props.uploadedVideo
                ? props.uploadedVideo
                : props.url;

            const isEmbedUrl = props.videoType === 'url' || videoSrc.includes('youtube') || videoSrc.includes('vimeo');

            return (
                <div className="bg-black" style={spacingStyles}>
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                            {isEmbedUrl ? (
                                <iframe
                                    src={`${videoSrc}${props.autoplay ? '?autoplay=1' : ''}${props.loop ? '&loop=1' : ''}${props.controls ? '&controls=1' : '&controls=0'}`}
                                    className="absolute top-0 left-0 w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={videoSrc}
                                    autoPlay={props.autoplay}
                                    controls={props.controls}
                                    loop={props.loop}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            )}

                            {/* Text Overlay */}
                            {props.overlayText?.enabled && (
                                <div
                                    className="absolute pointer-events-none px-4 py-2 rounded"
                                    style={{
                                        ...getPositionStyle(props.overlayText.position),
                                        fontSize: props.overlayText.fontSize,
                                        color: props.overlayText.color,
                                        backgroundColor: props.overlayText.backgroundColor,
                                        zIndex: 10,
                                    }}
                                >
                                    {props.overlayText.text}
                                </div>
                            )}

                            {/* Button Overlay */}
                            {props.overlayButton?.enabled && (
                                <button
                                    className="absolute px-6 py-3 rounded-lg font-bold transition-opacity hover:opacity-90"
                                    style={{
                                        ...getPositionStyle(props.overlayButton.position),
                                        backgroundColor: props.overlayButton.backgroundColor,
                                        color: props.overlayButton.textColor,
                                        zIndex: 10,
                                    }}
                                    onClick={() => alert('Button clicked!')}
                                >
                                    {props.overlayButton.text}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );

        case 'testimonials':
            return (
                <div className="bg-zinc-50 dark:bg-zinc-900" style={spacingStyles}>
                    <div className="max-w-6xl mx-auto px-8 py-12">
                        <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
                            What Our Customers Say
                        </h2>
                        <div className={`grid ${props.layout === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                            {props.items.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">⭐</span>
                                        ))}
                                    </div>
                                    <p className="text-zinc-700 dark:text-zinc-300 mb-4 italic">"{item.text}"</p>
                                    <div className="border-t pt-4">
                                        <p className="font-bold text-zinc-900 dark:text-zinc-50">{item.name}</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'faq':
            const [openIndex, setOpenIndex] = useState(null);
            return (
                <div className="bg-white dark:bg-zinc-900" style={spacingStyles}>
                    <div className="max-w-4xl mx-auto px-8 py-12">
                        <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {props.items.map((item, idx) => (
                                <div key={idx} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{item.question}</span>
                                        <span className="material-symbols-outlined">
                                            {openIndex === idx ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {openIndex === idx && (
                                        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
                                            <p className="text-zinc-700 dark:text-zinc-300">{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'stats':
            return (
                <div className="bg-primary text-white" style={spacingStyles}>
                    <div className="max-w-6xl mx-auto px-8 py-12">
                        <div className={`grid ${props.layout === 'horizontal' ? 'grid-cols-3' : 'grid-cols-1'} gap-8 text-center`}>
                            {props.items.map((item, idx) => (
                                <div key={idx}>
                                    <div className="text-5xl font-black mb-2">{item.value}</div>
                                    <div className="text-lg opacity-90">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'pricing':
            return (
                <div className="bg-zinc-50 dark:bg-zinc-900" style={spacingStyles}>
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-50">
                            Choose Your Plan
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {props.items.map((plan, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white dark:bg-zinc-800 rounded-lg p-8 ${plan.highlighted ? 'ring-4 ring-primary scale-105 shadow-2xl' : 'shadow-lg'}`}
                                >
                                    {plan.highlighted && (
                                        <div className="bg-primary text-white text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
                                            POPULAR
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">{plan.name}</h3>
                                    <div className="text-4xl font-black mb-6 text-primary">{plan.price}</div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-start gap-2">
                                                <span className="text-green-500 mt-1">✓</span>
                                                <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.highlighted ? 'bg-primary text-white hover:bg-primary/90' : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600'}`}>
                                        Get Started
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'contactForm':
            return (
                <div className="bg-white dark:bg-zinc-900" style={spacingStyles}>
                    <div className="max-w-2xl mx-auto px-8 py-12">
                        <h2 className="text-4xl font-bold text-center mb-4 text-zinc-900 dark:text-zinc-50">
                            {props.title}
                        </h2>
                        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
                            {props.subtitle}
                        </p>
                        <form className="space-y-6">
                            {props.fields.includes('name') && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                        placeholder="Your name"
                                    />
                                </div>
                            )}
                            {props.fields.includes('email') && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            )}
                            {props.fields.includes('message') && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                        placeholder="Your message..."
                                    ></textarea>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            >
                                {props.submitText}
                            </button>
                        </form>
                    </div>
                </div>
            );

        case 'slider':
            return (
                <div className="relative overflow-hidden" style={{ height: '24rem', ...spacingStyles }}>
                    <img
                        src={props.images[0]}
                        alt="Slide"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {props.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            );

        case 'productGrid':
            const filteredProducts = props.category
                ? products.filter(p => p.category === props.category)
                : products;

            const displayProducts = filteredProducts.slice(0, props.columns);

            return (
                <div className="bg-zinc-50 dark:bg-zinc-900" style={spacingStyles}>
                    <div className="px-8 py-8">
                        <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
                            {props.category ? `${props.category} Products` : 'Our Products'}
                        </h2>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(props.columns, 4)} gap-6`}>
                            {displayProducts.length > 0 ? (
                                displayProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-zinc-600 dark:text-zinc-400">
                                    No products available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );

        case 'productShowcase':
            const showcaseProduct = products.find(p => p.id === parseInt(props.productId)) || products[0];

            if (!showcaseProduct) {
                return (
                    <div className="p-8 text-center text-zinc-600 dark:text-zinc-400" style={spacingStyles}>
                        No product selected or available
                    </div>
                );
            }

            return (
                <div className="bg-white dark:bg-zinc-900" style={spacingStyles}>
                    <div className={`max-w-6xl mx-auto px-8 py-12 ${props.layout === 'side-by-side' ? 'grid md:grid-cols-2 gap-12 items-center' : 'text-center'}`}>
                        <div className={props.layout === 'stacked' ? 'mb-8' : ''}>
                            <img
                                src={showcaseProduct.image}
                                alt={showcaseProduct.name}
                                className="w-full rounded-lg object-cover"
                                style={{ maxHeight: '500px' }}
                            />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
                                {showcaseProduct.name}
                            </h2>
                            {props.showDescription && showcaseProduct.description && (
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                                    {showcaseProduct.description}
                                </p>
                            )}
                            {props.showPrice && (
                                <p className="text-3xl font-bold text-primary mb-6">
                                    ${showcaseProduct.price.toFixed(2)}
                                </p>
                            )}
                            {props.showAddToCart && (
                                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );

        case 'customHtml':
            return (
                <div style={spacingStyles}>
                    {props.css && (
                        <style dangerouslySetInnerHTML={{ __html: props.css }} />
                    )}
                    <div dangerouslySetInnerHTML={{ __html: props.html }} />
                </div>
            );

        default:
            return (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded">
                    Unknown component type: {type}
                </div>
            );
    }
};

export default ComponentRenderer;
