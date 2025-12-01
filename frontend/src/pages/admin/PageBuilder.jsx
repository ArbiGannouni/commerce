import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import axios from 'axios';
import Header from '../../components/Header';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

const PageBuilder = () => {
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [pageName, setPageName] = useState('home');
    const [pageSettings, setPageSettings] = useState({ defaultCategory: '' });
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [pages, setPages] = useState([]);
    const [customComponents, setCustomComponents] = useState([]);
    const [showNewPageDialog, setShowNewPageDialog] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [showSaveComponentDialog, setShowSaveComponentDialog] = useState(false);
    const [saveComponentName, setSaveComponentName] = useState('');
    const [saveComponentCategory, setSaveComponentCategory] = useState('custom');
    const [showPageSettingsDialog, setShowPageSettingsDialog] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadPage();
        loadPages();
        loadCustomComponents();
    }, [pageName]);

    const loadPages = async () => {
        try {
            const response = await axios.get('/api/builder/pages');
            setPages(response.data);
        } catch (error) {
            console.error('Error loading pages:', error);
        }
    };

    const loadCustomComponents = async () => {
        try {
            const response = await axios.get('/api/builder/custom-components');
            setCustomComponents(response.data);
        } catch (error) {
            console.error('Error loading custom components:', error);
        }
    };

    const loadPage = async () => {
        try {
            const response = await axios.get(`/api/page-builder/${pageName}`);
            setComponents(response.data.layout_data);
            setPageSettings(response.data.page_settings || { defaultCategory: '' });
        } catch (error) {
            console.log('No saved layout found, starting fresh');
            setComponents([]);
            setPageSettings({ defaultCategory: '' });
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addComponent = (type) => {
        const newComponent = {
            id: `${type}-${Date.now()}`,
            type,
            props: getDefaultProps(type)
        };
        setComponents([...components, newComponent]);
    };

    const addCustomComponent = (componentData) => {
        const newComponent = {
            ...componentData,
            id: `${componentData.type}-${Date.now()}`,
        };
        setComponents([...components, newComponent]);
    };

    const getDefaultProps = (type) => {
        const baseSpacing = {
            paddingTop: '0',
            paddingBottom: '0',
            paddingLeft: '0',
            paddingRight: '0',
            marginTop: '0',
            marginBottom: '0',
        };

        const defaults = {
            hero: {
                ...baseSpacing,
                title: 'Welcome to Our Store',
                subtitle: 'Discover amazing products',
                buttonText: 'Shop Now',
                backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
            },
            text: {
                ...baseSpacing,
                content: 'Add your text here...',
                alignment: 'left',
                fontSize: '16px',
            },
            image: {
                ...baseSpacing,
                src: 'https://via.placeholder.com/800x400',
                alt: 'Image',
            },
            banner: {
                ...baseSpacing,
                text: 'Special Offer!',
                backgroundColor: '#f47b25',
                textColor: '#ffffff',
            },
            productGrid: {
                ...baseSpacing,
                columns: 4,
                category: '',
            },
            slider: {
                ...baseSpacing,
                images: [
                    'https://via.placeholder.com/1200x400',
                    'https://via.placeholder.com/1200x400',
                ],
            },
            productShowcase: {
                ...baseSpacing,
                productId: '',
                layout: 'side-by-side',
                showDescription: true,
                showPrice: true,
                showAddToCart: true,
            },
            video: {
                ...baseSpacing,
                videoType: 'url', // 'url' or 'upload'
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                uploadedVideo: '',
                videoWidth: '100%',
                videoHeight: 'auto',
                autoplay: false,
                controls: true,
                loop: false,
                overlayText: {
                    enabled: false,
                    text: 'Your Text Here',
                    position: 'center',
                    customX: '50%',
                    customY: '50%',
                    fontSize: '2rem',
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                overlayButton: {
                    enabled: false,
                    text: 'Click Here',
                    position: 'bottom-center',
                    customX: '50%',
                    customY: '85%',
                    backgroundColor: '#f47b25',
                    textColor: '#ffffff',
                    buttonUrl: '',
                },
            },
            testimonials: {
                ...baseSpacing,
                items: [
                    { name: 'John Doe', role: 'Customer', text: 'Great product!', rating: 5 },
                    { name: 'Jane Smith', role: 'Client', text: 'Excellent service!', rating: 5 },
                ],
                layout: 'grid',
            },
            faq: {
                ...baseSpacing,
                items: [
                    { question: 'What is your return policy?', answer: 'You can return items within 30 days.' },
                    { question: 'Do you ship worldwide?', answer: 'Yes, we ship to most countries.' },
                ],
            },
            stats: {
                ...baseSpacing,
                items: [
                    { value: '10k+', label: 'Happy Customers' },
                    { value: '99%', label: 'Satisfaction Rate' },
                    { value: '24/7', label: 'Support' },
                ],
                layout: 'horizontal',
            },
            pricing: {
                ...baseSpacing,
                items: [
                    { name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'], highlighted: false },
                    { name: 'Pro', price: '$29', features: ['Everything in Basic', 'Feature 3', 'Feature 4'], highlighted: true },
                    { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Feature 5', 'Priority Support'], highlighted: false },
                ],
            },
            contactForm: {
                ...baseSpacing,
                title: 'Get in Touch',
                subtitle: 'Fill out the form below and we\'ll get back to you.',
                fields: ['name', 'email', 'message'],
                submitText: 'Send Message',
            },
            customHtml: {
                ...baseSpacing,
                html: '<div class="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">\n  <h2 class="text-4xl font-bold mb-4">Custom HTML Section</h2>\n  <p>Edit this HTML to create your custom design!</p>\n</div>',
                css: '',
            },
        };
        return defaults[type] || { ...baseSpacing };
    };

    const updateComponent = (id, newProps) => {
        const updatedComponents = components.map(comp =>
            comp.id === id ? { ...comp, props: newProps } : comp
        );
        setComponents(updatedComponents);

        // Update selected component to reflect changes
        if (selectedComponent?.id === id) {
            setSelectedComponent({ ...selectedComponent, props: newProps });
        }
    };

    const deleteComponent = (id) => {
        setComponents(components.filter(comp => comp.id !== id));
        if (selectedComponent?.id === id) {
            setSelectedComponent(null);
        }
    };

    const savePage = async () => {
        setSaving(true);
        try {
            await axios.post('/api/page-builder/save', {
                page_name: pageName,
                layout_data: components,
                page_settings: pageSettings
            });
            alert('Page saved successfully!');
        } catch (error) {
            alert('Error saving page: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const saveAsCustomComponent = async () => {
        if (!selectedComponent || !saveComponentName.trim()) {
            alert('Please enter a component name');
            return;
        }

        try {
            await axios.post('/api/builder/custom-components', {
                name: saveComponentName,
                component_data: selectedComponent,
                category: saveComponentCategory
            });
            setShowSaveComponentDialog(false);
            setSaveComponentName('');
            setSaveComponentCategory('custom');
            loadCustomComponents();
            alert('Component saved successfully!');
        } catch (error) {
            alert('Error saving component: ' + (error.response?.data?.message || error.message));
        }
    };

    const createNewPage = async () => {
        if (!newPageName.trim()) {
            alert('Please enter a page name');
            return;
        }

        const pageSlug = newPageName.toLowerCase().replace(/\s+/g, '-');

        try {
            await axios.post('/api/builder/pages', { page_name: pageSlug });
            alert(`Page "${newPageName}" created!`);
            setNewPageName('');
            setShowNewPageDialog(false);
            loadPages();
            setPageName(pageSlug);
        } catch (error) {
            alert('Error creating page: ' + (error.response?.data?.message || error.message));
        }
    };

    const deletePage = async (pageToDelete) => {
        if (!window.confirm(`Delete page "${pageToDelete}"?`)) return;

        try {
            await axios.delete(`/api/builder/pages/${pageToDelete}`);
            alert('Page deleted!');
            loadPages();
            if (pageName === pageToDelete) {
                setPageName('home');
            }
        } catch (error) {
            alert('Error deleting page: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                {/* Component Library */}
                <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
                    <ComponentLibrary
                        onAddComponent={addComponent}
                        customComponents={customComponents}
                        onAddCustomComponent={addCustomComponent}
                        onLoadCustomComponents={loadCustomComponents}
                    />
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
                    <div className="p-4">
                        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Page:</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={pageName}
                                            onChange={(e) => setPageName(e.target.value)}
                                            className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                        >
                                            {pages.map(page => (
                                                <option key={page.page_name} value={page.page_name}>
                                                    {page.page_name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setShowNewPageDialog(true)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            title="Create new page"
                                        >
                                            + New Page
                                        </button>
                                        {pageName !== 'home' && (
                                            <button
                                                onClick={() => deletePage(pageName)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                title="Delete current page"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {selectedComponent && !showPreview && (
                                    <button
                                        onClick={() => setShowSaveComponentDialog(true)}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                    >
                                        Save Component
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowPageSettingsDialog(true)}
                                    className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700"
                                    title="Page Settings"
                                >
                                    ⚙️ Settings
                                </button>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {showPreview ? 'Edit' : 'Preview'}
                                </button>
                                <button
                                    onClick={savePage}
                                    disabled={saving}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Page'}
                                </button>
                            </div>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                <Canvas
                                    components={components}
                                    selectedComponent={selectedComponent}
                                    onSelectComponent={setSelectedComponent}
                                    onDeleteComponent={deleteComponent}
                                    showPreview={showPreview}
                                />
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                {/* Properties Panel */}
                {!showPreview && selectedComponent && (
                    <div className="w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto">
                        <PropertiesPanel
                            component={selectedComponent}
                            onUpdateComponent={(newProps) => updateComponent(selectedComponent.id, newProps)}
                            onClose={() => setSelectedComponent(null)}
                            pageSettings={pageSettings}
                        />
                    </div>
                )}
            </div>

            {/* New Page Dialog */}
            {showNewPageDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Create New Page</h3>
                        <input
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            placeholder="Page name (e.g., About Us, Contact)"
                            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 mb-4"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={createNewPage}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewPageDialog(false);
                                    setNewPageName('');
                                }}
                                className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Component Dialog */}
            {showSaveComponentDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Save Component to Library</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Component Name</label>
                                <input
                                    value={saveComponentName}
                                    onChange={(e) => setSaveComponentName(e.target.value)}
                                    placeholder="e.g., My Hero Section"
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Category</label>
                                <select
                                    value={saveComponentCategory}
                                    onChange={(e) => setSaveComponentCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                >
                                    <option value="custom">💾 My Components</option>
                                    <option value="basic">🎨 Basic Elements</option>
                                    <option value="media">🎬 Media Components</option>
                                    <option value="ecommerce">🛍️ E-Commerce</option>
                                    <option value="social">💬 Social Proof</option>
                                    <option value="content">📄 Content Sections</option>
                                    <option value="forms">📧 Forms & CTAs</option>
                                </select>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    Choose where to save this component in your library
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={saveAsCustomComponent}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowSaveComponentDialog(false);
                                    setSaveComponentName('');
                                    setSaveComponentCategory('custom');
                                }}
                                className="flex-1 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Settings Dialog */}
            {showPageSettingsDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Page Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Default Product Category</label>
                                <select
                                    value={pageSettings.defaultCategory || ''}
                                    onChange={(e) => setPageSettings({ ...pageSettings, defaultCategory: e.target.value })}
                                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Home">Home</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Product components on this page will use this category by default
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowPageSettingsDialog(false)}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageBuilder;
