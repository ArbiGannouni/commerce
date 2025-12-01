import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';

const SiteSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'E-Commerce',
        siteTagline: 'Your one-stop shop',
        logoUrl: '',
        primaryColor: '#f47b25',
        favicon: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await axios.get('/api/settings');
            if (response.data) {
                setSettings({ ...settings, ...response.data });
            }
        } catch (error) {
            console.log('No saved settings, using defaults');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await axios.post('/api/settings', settings);
            setMessage('Settings saved! Refresh the page to see changes.');
        } catch (error) {
            setMessage('Error saving settings: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-4xl mx-auto p-8">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-2">Site Settings</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8">Customize your site branding and appearance</p>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {message}
                        </div>
                    )}

                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Site Name</label>
                            <input
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                placeholder="E-Commerce"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Appears in the header and browser title</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Site Tagline</label>
                            <input
                                value={settings.siteTagline}
                                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                placeholder="Your one-stop shop"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Short description of your site</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Logo URL (Optional)</label>
                            <input
                                value={settings.logoUrl}
                                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                placeholder="https://example.com/logo.png"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Leave empty to use default logo</p>
                            {settings.logoUrl && (
                                <div className="mt-2">
                                    <img src={settings.logoUrl} alt="Logo preview" className="h-12 object-contain" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                Primary Color (All Buttons & Links)
                            </label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="h-12 w-24 px-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-mono"
                                    placeholder="#f47b25"
                                />
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">
                                Controls the color of all buttons, links, icons, and accent elements throughout your site
                            </p>
                            {/* Color Preview */}
                            <div className="mt-3 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 font-medium">Preview:</p>
                                <div className="flex gap-3 flex-wrap">
                                    <button
                                        className="px-4 py-2 rounded-lg text-white font-bold shadow-sm"
                                        style={{ backgroundColor: settings.primaryColor }}
                                    >
                                        Primary Button
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-lg font-bold"
                                        style={{
                                            backgroundColor: `${settings.primaryColor}20`,
                                            color: settings.primaryColor
                                        }}
                                    >
                                        Secondary Button
                                    </button>
                                    <a
                                        href="#"
                                        className="px-4 py-2 font-medium underline"
                                        style={{ color: settings.primaryColor }}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Link Example
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Favicon URL (Optional)</label>
                            <input
                                value={settings.favicon}
                                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                placeholder="https://example.com/favicon.ico"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Browser tab icon (32x32px recommended)</p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            💡 Tip: After saving settings, you may need to refresh the page to see changes take effect.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SiteSettings;
