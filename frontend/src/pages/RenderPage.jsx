import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../config/api.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ComponentRenderer from './admin/ComponentRenderer';

const RenderPage = () => {
    const { pageName } = useParams();
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPage();
    }, [pageName]);

    const loadPage = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/page-builder/${pageName || 'home'}`);
            setComponents(response.data.layout_data);
        } catch (error) {
            console.error('Error loading page:', error);
            setError('Page not found or not yet created');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading page...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="container mx-auto px-4 py-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-zinc-400 mb-4">error</span>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Page Not Found</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
                    <a href="/" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
                        Go to Homepage
                    </a>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {components.length === 0 ? (
                    <div className="container mx-auto px-4 py-12 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400">This page has no content yet.</p>
                    </div>
                ) : (
                    components.map((component) => (
                        <ComponentRenderer key={component.id} component={component} />
                    ))
                )}
            </main>
            <Footer />
        </div>
    );
};

export default RenderPage;
