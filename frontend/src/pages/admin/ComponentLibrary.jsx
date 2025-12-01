import { useState } from 'react';

const ComponentLibrary = ({ onAddComponent, customComponents, onAddCustomComponent, onLoadCustomComponents }) => {
    const [expandedCategory, setExpandedCategory] = useState('basic');

    const categories = {
        basic: {
            name: '🎨 Basic Elements',
            components: [
                { type: 'hero', label: 'Hero Section', icon: '🎯', description: 'Large banner with title and CTA' },
                { type: 'text', label: 'Text Block', icon: '📝', description: 'Paragraph or heading text' },
                { type: 'image', label: 'Image', icon: '🖼️', description: 'Single image block' },
                { type: 'banner', label: 'Banner', icon: '🎨', description: 'Colored banner with text' },
                { type: 'button', label: 'Button', icon: '🔘', description: 'Call-to-action button' },
                { type: 'divider', label: 'Divider', icon: '➖', description: 'Horizontal line separator' },
            ]
        },
        media: {
            name: '🎬 Media Components',
            components: [
                { type: 'video', label: 'Video', icon: '🎬', description: 'Video player with overlays' },
                { type: 'slider', label: 'Image Slider', icon: '🎞️', description: 'Image carousel' },
                { type: 'gallery', label: 'Image Gallery', icon: '🖼️', description: 'Grid photo gallery' },
                { type: 'iframe', label: 'Embed/iFrame', icon: '🪟', description: 'Embed external content' },
            ]
        },
        ecommerce: {
            name: '🛍️ E-Commerce',
            components: [
                { type: 'productGrid', label: 'Product Grid', icon: '📦', description: 'Grid of products' },
                { type: 'productShowcase', label: 'Product Showcase', icon: '⭐', description: 'Single product highlight' },
                { type: 'categories', label: 'Categories', icon: '🏷️', description: 'Product categories grid' },
                { type: 'countdown', label: 'Countdown Timer', icon: '⏱️', description: 'Sale countdown' },
            ]
        },
        social: {
            name: '💬 Social Proof',
            components: [
                { type: 'testimonials', label: 'Testimonials', icon: '💬', description: 'Customer reviews' },
                { type: 'stats', label: 'Statistics', icon: '📊', description: 'Key metrics' },
                { type: 'team', label: 'Team Members', icon: '👥', description: 'Team profiles' },
                { type: 'logos', label: 'Logo Showcase', icon: '🏢', description: 'Partner/client logos' },
            ]
        },
        content: {
            name: '📄 Content Sections',
            components: [
                { type: 'faq', label: 'FAQ Accordion', icon: '❓', description: 'Q&A section' },
                { type: 'pricing', label: 'Pricing Tables', icon: '💰', description: 'Pricing plans' },
                { type: 'features', label: 'Feature Grid', icon: '✨', description: 'Product features' },
                { type: 'timeline', label: 'Timeline', icon: '📅', description: 'Process/history timeline' },
            ]
        },
        forms: {
            name: '📧 Forms & CTAs',
            components: [
                { type: 'contactForm', label: 'Contact Form', icon: '📧', description: 'Get in touch form' },
                { type: 'newsletter', label: 'Newsletter', icon: '📰', description: 'Email signup' },
                { type: 'cta', label: 'CTA Section', icon: '🎯', description: 'Call-to-action block' },
            ]
        },
        advanced: {
            name: '⚡ Advanced',
            components: [
                { type: 'customHtml', label: 'Custom HTML', icon: '💻', description: 'Write custom code' },
                { type: 'spacer', label: 'Spacer', icon: '⬜', description: 'Empty space' },
            ]
        },
    };

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <div className="p-4">
            <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-zinc-50">Components</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">Click to add to canvas</p>

            {/* Categorized Components */}
            <div className="space-y-2">
                {Object.entries(categories).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleCategory(categoryKey)}
                            className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-between transition-colors"
                        >
                            <span className="font-medium text-sm text-zinc-900 dark:text-zinc-50">{category.name}</span>
                            <span className="material-symbols-outlined text-sm">
                                {expandedCategory === categoryKey ? 'expand_less' : 'expand_more'}
                            </span>
                        </button>

                        {expandedCategory === categoryKey && (
                            <div className="p-2 space-y-1 bg-white dark:bg-zinc-900">
                                {category.components.map((comp) => (
                                    <button
                                        key={comp.type}
                                        onClick={() => onAddComponent(comp.type)}
                                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-left transition-colors group"
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="text-xl">{comp.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs text-zinc-900 dark:text-zinc-50 group-hover:text-primary truncate">
                                                    {comp.label}
                                                </div>
                                                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5 truncate">
                                                    {comp.description}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Custom/Saved Components */}
            {customComponents && customComponents.length > 0 && (
                <>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 my-4"></div>
                    <div className="border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleCategory('saved')}
                            className="w-full px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/40 flex items-center justify-between transition-colors"
                        >
                            <span className="font-medium text-sm text-purple-900 dark:text-purple-50">💾 My Saved Components</span>
                            <span className="material-symbols-outlined text-sm">
                                {expandedCategory === 'saved' ? 'expand_less' : 'expand_more'}
                            </span>
                        </button>

                        {expandedCategory === 'saved' && (
                            <div className="bg-white dark:bg-zinc-900">
                                {/* Group by category */}
                                {Object.entries({
                                    custom: customComponents.filter(c => !c.category || c.category === 'custom'),
                                    basic: customComponents.filter(c => c.category === 'basic'),
                                    media: customComponents.filter(c => c.category === 'media'),
                                    ecommerce: customComponents.filter(c => c.category === 'ecommerce'),
                                    social: customComponents.filter(c => c.category === 'social'),
                                    content: customComponents.filter(c => c.category === 'content'),
                                    forms: customComponents.filter(c => c.category === 'forms'),
                                }).map(([catKey, comps]) => {
                                    if (comps.length === 0) return null;

                                    const categoryNames = {
                                        custom: '💾 My Components',
                                        basic: '🎨 Basic Elements',
                                        media: '🎬 Media Components',
                                        ecommerce: '🛍️ E-Commerce',
                                        social: '💬 Social Proof',
                                        content: '📄 Content Sections',
                                        forms: '📧 Forms & CTAs'
                                    };

                                    return (
                                        <div key={catKey} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                            <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50">
                                                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {categoryNames[catKey]} ({comps.length})
                                                </p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                {comps.map((comp) => (
                                                    <div key={comp.id} className="relative">
                                                        <button
                                                            onClick={() => onAddCustomComponent(comp.component_data)}
                                                            className="w-full p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 text-left transition-colors group"
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-xl">💾</span>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-xs text-zinc-900 dark:text-zinc-50 group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                                                                        {comp.name}
                                                                    </div>
                                                                    <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5 truncate">
                                                                        Type: {comp.component_data.type}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (window.confirm('Delete this component?')) {
                                                                            fetch(`/api/builder/custom-components/${comp.id}`, {
                                                                                method: 'DELETE',
                                                                                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                                                            }).then(() => onLoadCustomComponents());
                                                                        }
                                                                    }}
                                                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                                                    title="Delete"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm text-red-500">delete</span>
                                                                </button>
                                                            </div>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-400">
                    💡 Tip: Click a category to expand and see all components!
                </p>
            </div>
        </div>
    );
};

export default ComponentLibrary;
