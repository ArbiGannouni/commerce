import { useState } from 'react';

const PropertiesPanel = ({ component, onUpdateComponent, onClose, pageSettings }) => {
    const { type, props } = component;

    const handleChange = (key, value) => {
        onUpdateComponent({ ...props, [key]: value });
    };

    const handleArrayChange = (arrayKey, index, field, value) => {
        const newArray = [...props[arrayKey]];
        newArray[index] = { ...newArray[index], [field]: value };
        handleChange(arrayKey, newArray);
    };

    const addArrayItem = (arrayKey, defaultItem) => {
        const newArray = [...(props[arrayKey] || []), defaultItem];
        handleChange(arrayKey, newArray);
    };

    const removeArrayItem = (arrayKey, index) => {
        const newArray = props[arrayKey].filter((_, i) => i !== index);
        handleChange(arrayKey, newArray);
    };

    // Spacing controls component (reusable)
    const SpacingControls = () => (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Spacing</h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">Padding Top</label>
                    <input
                        value={props.paddingTop || '0'}
                        onChange={(e) => handleChange('paddingTop', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        placeholder="0, 1rem, 20px"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">Padding Bottom</label>
                    <input
                        value={props.paddingBottom || '0'}
                        onChange={(e) => handleChange('paddingBottom', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        placeholder="0, 1rem, 20px"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">Padding Left</label>
                    <input
                        value={props.paddingLeft || '0'}
                        onChange={(e) => handleChange('paddingLeft', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        placeholder="0, 1rem, 20px"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">Padding Right</label>
                    <input
                        value={props.paddingRight || '0'}
                        onChange={(e) => handleChange('paddingRight', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        placeholder="0, 1rem, 20px"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">Margin Top</label>
                    <input
                        value={props.marginTop || '0'}
                        onChange={(e) => handleChange('marginTop', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        placeholder="0, 1rem, 20px"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">Margin Bottom</label>
                    <input
                        value={props.marginBottom || '0'}
                        onChange={(e) => handleChange('marginBottom', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        placeholder="0, 1rem, 20px"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Edit Properties</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded"
                >
                    <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">close</span>
                </button>
            </div>

            <div className="space-y-4">
                {/* HERO COMPONENT */}
                {type === 'hero' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Title</label>
                            <input
                                value={props.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Subtitle</label>
                            <input
                                value={props.subtitle}
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Button Text</label>
                            <input
                                value={props.buttonText}
                                onChange={(e) => handleChange('buttonText', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Background Image URL</label>
                            <input
                                value={props.backgroundImage}
                                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* TEXT COMPONENT */}
                {type === 'text' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Content</label>
                            <textarea
                                value={props.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Alignment</label>
                            <select
                                value={props.alignment}
                                onChange={(e) => handleChange('alignment', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Font Size</label>
                            <input
                                value={props.fontSize}
                                onChange={(e) => handleChange('fontSize', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                placeholder="16px"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* IMAGE COMPONENT */}
                {type === 'image' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Image URL</label>
                            <input
                                value={props.src}
                                onChange={(e) => handleChange('src', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Alt Text</label>
                            <input
                                value={props.alt}
                                onChange={(e) => handleChange('alt', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* BANNER COMPONENT */}
                {type === 'banner' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Text</label>
                            <input
                                value={props.text}
                                onChange={(e) => handleChange('text', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Background Color</label>
                            <input
                                type="color"
                                value={props.backgroundColor}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                className="w-full h-10 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Text Color</label>
                            <input
                                type="color"
                                value={props.textColor}
                                onChange={(e) => handleChange('textColor', e.target.value)}
                                className="w-full h-10 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* VIDEO COMPONENT */}
                {type === 'video' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Video Source</label>
                            <select
                                value={props.videoType}
                                onChange={(e) => handleChange('videoType', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 mb-3"
                            >
                                <option value="url">Embed URL (YouTube, Vimeo)</option>
                                <option value="upload">Upload Video File</option>
                            </select>
                        </div>

                        {props.videoType === 'url' && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Video URL</label>
                                <input
                                    value={props.url}
                                    onChange={(e) => handleChange('url', e.target.value)}
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                />
                                <p className="text-xs text-zinc-500 mt-1">Use embed URL format</p>
                            </div>
                        )}

                        {props.videoType === 'upload' && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Upload Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append('video', file);
                                            try {
                                                const response = await fetch('/api/upload/video', {
                                                    method: 'POST',
                                                    body: formData,
                                                    headers: {
                                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                });
                                                const data = await response.json();
                                                handleChange('uploadedVideo', data.url);
                                                alert('Video uploaded successfully!');
                                            } catch (error) {
                                                alert('Error uploading video');
                                            }
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                />
                                {props.uploadedVideo && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Video uploaded</p>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 flex-wrap">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={props.autoplay}
                                    onChange={(e) => handleChange('autoplay', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Autoplay</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={props.controls}
                                    onChange={(e) => handleChange('controls', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Show Controls</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={props.loop}
                                    onChange={(e) => handleChange('loop', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Loop</span>
                            </label>
                        </div>

                        {/* Text Overlay */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <label className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    checked={props.overlayText?.enabled}
                                    onChange={(e) => handleChange('overlayText', { ...props.overlayText, enabled: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">Enable Text Overlay</span>
                            </label>

                            {props.overlayText?.enabled && (
                                <>
                                    <div className="mb-2">
                                        <label className="block text-xs font-medium mb-1">Text</label>
                                        <input
                                            value={props.overlayText.text}
                                            onChange={(e) => handleChange('overlayText', { ...props.overlayText, text: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                            placeholder="Your text"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-xs font-medium mb-1">Position</label>
                                        <select
                                            value={props.overlayText.position}
                                            onChange={(e) => handleChange('overlayText', { ...props.overlayText, position: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                        >
                                            <option value="top-left">Top Left</option>
                                            <option value="top-center">Top Center</option>
                                            <option value="top-right">Top Right</option>
                                            <option value="center">Center</option>
                                            <option value="bottom-left">Bottom Left</option>
                                            <option value="bottom-center">Bottom Center</option>
                                            <option value="bottom-right">Bottom Right</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Font Size</label>
                                            <input
                                                value={props.overlayText.fontSize}
                                                onChange={(e) => handleChange('overlayText', { ...props.overlayText, fontSize: e.target.value })}
                                                className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                                placeholder="2rem"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Text Color</label>
                                            <input
                                                type="color"
                                                value={props.overlayText.color}
                                                onChange={(e) => handleChange('overlayText', { ...props.overlayText, color: e.target.value })}
                                                className="w-full h-8 border rounded"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Background</label>
                                        <input
                                            value={props.overlayText.backgroundColor}
                                            onChange={(e) => handleChange('overlayText', { ...props.overlayText, backgroundColor: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                            placeholder="rgba(0, 0, 0, 0.5)"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Button Overlay */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <label className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    checked={props.overlayButton?.enabled}
                                    onChange={(e) => handleChange('overlayButton', { ...props.overlayButton, enabled: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">Enable Button Overlay</span>
                            </label>

                            {props.overlayButton?.enabled && (
                                <>
                                    <div className="mb-2">
                                        <label className="block text-xs font-medium mb-1">Button Text</label>
                                        <input
                                            value={props.overlayButton.text}
                                            onChange={(e) => handleChange('overlayButton', { ...props.overlayButton, text: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                            placeholder="Click Here"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-xs font-medium mb-1">Position</label>
                                        <select
                                            value={props.overlayButton.position}
                                            onChange={(e) => handleChange('overlayButton', { ...props.overlayButton, position: e.target.value })}
                                            className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                        >
                                            <option value="top-left">Top Left</option>
                                            <option value="top-center">Top Center</option>
                                            <option value="top-right">Top Right</option>
                                            <option value="center">Center</option>
                                            <option value="bottom-left">Bottom Left</option>
                                            <option value="bottom-center">Bottom Center</option>
                                            <option value="bottom-right">Bottom Right</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Button Color</label>
                                            <input
                                                type="color"
                                                value={props.overlayButton.backgroundColor}
                                                onChange={(e) => handleChange('overlayButton', { ...props.overlayButton, backgroundColor: e.target.value })}
                                                className="w-full h-8 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Text Color</label>
                                            <input
                                                type="color"
                                                value={props.overlayButton.textColor}
                                                onChange={(e) => handleChange('overlayButton', { ...props.overlayButton, textColor: e.target.value })}
                                                className="w-full h-8 border rounded"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <SpacingControls />
                    </>
                )}

                {/* TESTIMONIALS COMPONENT */}
                {type === 'testimonials' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Layout</label>
                            <select
                                value={props.layout}
                                onChange={(e) => handleChange('layout', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            >
                                <option value="grid">Grid</option>
                                <option value="list">List</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Testimonials</label>
                                <button
                                    onClick={() => addArrayItem('items', { name: 'Customer', role: 'Client', text: 'Great service!', rating: 5 })}
                                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    + Add
                                </button>
                            </div>
                            {props.items.map((item, idx) => (
                                <div key={idx} className="border border-zinc-300 dark:border-zinc-700 rounded p-3 mb-2">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Testimonial {idx + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('items', idx)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        value={item.name}
                                        onChange={(e) => handleArrayChange('items', idx, 'name', e.target.value)}
                                        placeholder="Name"
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <input
                                        value={item.role}
                                        onChange={(e) => handleArrayChange('items', idx, 'role', e.target.value)}
                                        placeholder="Role"
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <textarea
                                        value={item.text}
                                        onChange={(e) => handleArrayChange('items', idx, 'text', e.target.value)}
                                        placeholder="Testimonial text"
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <select
                                        value={item.rating}
                                        onChange={(e) => handleArrayChange('items', idx, 'rating', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                    >
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* FAQ COMPONENT */}
                {type === 'faq' && (
                    <>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">FAQ Items</label>
                                <button
                                    onClick={() => addArrayItem('items', { question: 'New question?', answer: 'Answer here.' })}
                                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    + Add
                                </button>
                            </div>
                            {props.items.map((item, idx) => (
                                <div key={idx} className="border border-zinc-300 dark:border-zinc-700 rounded p-3 mb-2">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">FAQ {idx + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('items', idx)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        value={item.question}
                                        onChange={(e) => handleArrayChange('items', idx, 'question', e.target.value)}
                                        placeholder="Question"
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <textarea
                                        value={item.answer}
                                        onChange={(e) => handleArrayChange('items', idx, 'answer', e.target.value)}
                                        placeholder="Answer"
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                    />
                                </div>
                            ))}
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* STATS COMPONENT */}
                {type === 'stats' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Layout</label>
                            <select
                                value={props.layout}
                                onChange={(e) => handleChange('layout', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            >
                                <option value="horizontal">Horizontal</option>
                                <option value="vertical">Vertical</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Statistics</label>
                                <button
                                    onClick={() => addArrayItem('items', { value: '100+', label: 'Metric' })}
                                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    + Add
                                </button>
                            </div>
                            {props.items.map((item, idx) => (
                                <div key={idx} className="border border-zinc-300 dark:border-zinc-700 rounded p-3 mb-2">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Stat {idx + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('items', idx)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        value={item.value}
                                        onChange={(e) => handleArrayChange('items', idx, 'value', e.target.value)}
                                        placeholder="Value (e.g., 10k+)"
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <input
                                        value={item.label}
                                        onChange={(e) => handleArrayChange('items', idx, 'label', e.target.value)}
                                        placeholder="Label"
                                        className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-zinc-800"
                                    />
                                </div>
                            ))}
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* PRICING COMPONENT */}
                {type === 'pricing' && (
                    <>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pricing Plans</label>
                                <button
                                    onClick={() => addArrayItem('items', { name: 'Plan', price: '$99', features: ['Feature 1'], highlighted: false })}
                                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    + Add
                                </button>
                            </div>
                            {props.items.map((plan, idx) => (
                                <div key={idx} className="border border-zinc-300 dark:border-zinc-700 rounded p-3 mb-2">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Plan {idx + 1}</span>
                                        <button
                                            onClick={() => removeArrayItem('items', idx)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        value={plan.name}
                                        onChange={(e) => handleArrayChange('items', idx, 'name', e.target.value)}
                                        placeholder="Plan name"
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <input
                                        value={plan.price}
                                        onChange={(e) => handleArrayChange('items', idx, 'price', e.target.value)}
                                        placeholder="Price"
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <textarea
                                        value={plan.features.join('\n')}
                                        onChange={(e) => handleArrayChange('items', idx, 'features', e.target.value.split('\n'))}
                                        placeholder="Features (one per line)"
                                        rows={3}
                                        className="w-full px-2 py-1 text-sm border rounded mb-2 bg-white dark:bg-zinc-800"
                                    />
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={plan.highlighted}
                                            onChange={(e) => handleArrayChange('items', idx, 'highlighted', e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Highlight this plan</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* CONTACT FORM COMPONENT */}
                {type === 'contactForm' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Title</label>
                            <input
                                value={props.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Subtitle</label>
                            <input
                                value={props.subtitle}
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Submit Button Text</label>
                            <input
                                value={props.submitText}
                                onChange={(e) => handleChange('submitText', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* SLIDER COMPONENT */}
                {type === 'slider' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Image URLs (comma separated)</label>
                            <textarea
                                value={props.images.join(', ')}
                                onChange={(e) => handleChange('images', e.target.value.split(',').map(url => url.trim()))}
                                rows={3}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* PRODUCT GRID COMPONENT */}
                {type === 'productGrid' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Number of Columns</label>
                            <select
                                value={props.columns}
                                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            >
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Category Filter</label>
                            <select
                                value={props.category || pageSettings?.defaultCategory || ''}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            >
                                <option value="">All Categories (or use page default)</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Home">Home</option>
                                <option value="Sports">Sports</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            {pageSettings?.defaultCategory && !props.category && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    Using page default: {pageSettings.defaultCategory}
                                </p>
                            )}
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* PRODUCT SHOWCASE COMPONENT */}
                {type === 'productShowcase' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Product ID</label>
                            <input
                                type="number"
                                value={props.productId}
                                onChange={(e) => handleChange('productId', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                                placeholder="1, 2, 3..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Layout</label>
                            <select
                                value={props.layout}
                                onChange={(e) => handleChange('layout', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                            >
                                <option value="side-by-side">Side by Side</option>
                                <option value="stacked">Stacked</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={props.showDescription}
                                    onChange={(e) => handleChange('showDescription', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Show Description</span>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={props.showPrice}
                                    onChange={(e) => handleChange('showPrice', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Show Price</span>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={props.showAddToCart}
                                    onChange={(e) => handleChange('showAddToCart', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Show Add to Cart Button</span>
                            </label>
                        </div>
                        <SpacingControls />
                    </>
                )}

                {/* CUSTOM HTML COMPONENT */}
                {type === 'customHtml' && (
                    <>
                        <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                            <p className="text-xs text-yellow-800 dark:text-yellow-400">
                                ⚠️ Use Tailwind CSS classes or write CSS below. HTML is rendered directly.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">HTML Code</label>
                            <textarea
                                value={props.html}
                                onChange={(e) => handleChange('html', e.target.value)}
                                rows={12}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-mono text-sm"
                                placeholder='<div class="p-8">...</div>'
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                                Custom CSS (Optional)
                            </label>
                            <textarea
                                value={props.css}
                                onChange={(e) => handleChange('css', e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-mono text-sm"
                                placeholder=".my-class { color: red; }"
                            />
                        </div>
                        <SpacingControls />
                    </>
                )}
            </div>
        </div>
    );
};

export default PropertiesPanel;
