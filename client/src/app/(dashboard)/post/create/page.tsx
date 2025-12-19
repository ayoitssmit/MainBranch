"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Image as ImageIcon, Globe, MessageSquare, X, Trash2 } from 'lucide-react';

export default function CreatePostPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const removeImage = () => {
        setImage(null);
        if (preview) {
            URL.revokeObjectURL(preview); // Clean up memory
            setPreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Post content is required');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', 'Untitled');
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data' // Axios sets this automatically
                }
            });

            router.push('/feed');
            router.refresh(); 
        } catch (err: any) {
            console.error('Create Post Failed:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-[550px] mx-auto py-8 px-4">
             <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg overflow-hidden relative">
                 <button onClick={() => router.back()} className="absolute top-3 right-3 text-gray-400 hover:text-white">
                    <X size={20} />
                 </button>
                
                <div className="p-4 border-b border-gray-700/50 flex items-center gap-3">
                    <img 
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} 
                        className="w-12 h-12 rounded-full border border-gray-600"
                        alt={user.username}
                    />
                    <div>
                        <h2 className="font-semibold text-lg text-white">{user.displayName || user.username}</h2>
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full w-fit mt-1 border border-gray-700">
                            <Globe size={10} />
                            <span>Anyone</span>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <textarea
                        className="w-full h-32 bg-transparent text-xl text-white placeholder-gray-500 border-none focus:ring-0 resize-none"
                        placeholder="What do you want to talk about?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                    />
                    
                    {preview && (
                        <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-700/50 group">
                            <img src={preview} alt="Preview" className="w-full h-auto max-h-[400px] object-cover" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={removeImage}
                                    className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="px-4 pb-2 text-red-500 text-sm animated fadeIn">
                        {error}
                    </div>
                )}

                <div className="p-4 flex justify-between items-center mt-2 border-t border-gray-700/30">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-full transition-colors tooltip"
                            title="Add Media"
                        >
                            <ImageIcon size={20} />
                        </button>
                        {/* Hidden Input */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        disabled={loading || !content.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                        Post
                    </button>
                </div>
             </div>
        </div>
    );
}
