import { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
    const [siteSettings, setSiteSettings] = useState({
        siteName: 'E-Commerce',
        logoUrl: '',
        primaryColor: '#f47b25'
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await axios.get('/api/settings');
            setSiteSettings({
                siteName: response.data.siteName || 'E-Commerce',
                logoUrl: response.data.logoUrl || '',
                primaryColor: response.data.primaryColor || '#f47b25'
            });
        } catch (error) {
            console.log('Using default settings');
        }
    };

    return (
        <footer className="flex justify-center border-t border-solid border-black/10 dark:border-white/10 mt-10">
            <div className="w-full max-w-7xl px-4 sm:px-10 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4 md:col-span-1">
                        <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
                            {siteSettings.logoUrl ? (
                                <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-6 object-contain" />
                            ) : (
                                <div className="size-6" style={{ color: siteSettings.primaryColor }}>
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                            )}
                            <h2 className="text-zinc-900 dark:text-zinc-50 text-xl font-bold leading-tight tracking-tight">
                                {siteSettings.siteName}
                            </h2>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Yourone-stop shop for everything you need. Quality products, amazing prices.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Customer Service</h3>
                        <a className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-primary dark:hover:text-primary transition-colors" href="#">
                            Contact
                        </a>
                        <a className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-primary dark:hover:text-primary transition-colors" href="#">
                            FAQ
                        </a>
                        <a className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-primary dark:hover:text-primary transition-colors" href="#">
                            Shipping & Returns
                        </a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Company Info</h3>
                        <a className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-primary dark:hover:text-primary transition-colors" href="#">
                            About Us
                        </a>
                        <a className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-primary dark:hover:text-primary transition-colors" href="#">
                            Careers
                        </a>
                        <a className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-primary dark:hover:text-primary transition-colors" href="#">
                            Press
                        </a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Follow Us</h3>
                        <div className="flex gap-4">
                            <a className="text-gray-500 hover:text-primary" href="#">
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
                                </svg>
                            </a>
                            <a className="text-gray-500 hover:text-primary" href="#">
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                            <a className="text-gray-500 hover:text-primary" href="#">
                                <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 14a2 2 0 110-4 2 2 0 010 4z" fillRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-solid border-black/10 dark:border-white/10 mt-10 pt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <p>© 2024 {siteSettings.siteName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
