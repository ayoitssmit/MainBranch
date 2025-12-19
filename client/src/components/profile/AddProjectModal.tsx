"use client";
import React, { useState } from 'react';
import { X, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface AddProjectModalProps {
    onClose: () => void;
    onSave: (project: any) => void;
}

export default function AddProjectModal({ onClose, onSave }: AddProjectModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [tags, setTags] = useState('');
    
    // In a real app we'd upload an image here. For now just a link or placeholder?
    // Let's stick to text inputs for simplicity as per requirements "add new projects"
    // If user wants image, we might need a file uploader later. 
    // For now, let's skip image upload to keep it streamlined, or add an optional image URL field.
    const [image, setImage] = useState(''); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            link,
            image, // URL
            tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg w-full max-w-md shadow-2xl">
                <header className="flex justify-between items-center p-4 border-b border-[hsl(var(--ide-border))]">
                    <h2 className="text-xl font-bold text-white">Add Project</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Title</label>
                        <input 
                            type="text" required
                            className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Description</label>
                         <textarea 
                            className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[80px]"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                         />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Project Link</label>
                        <div className="flex items-center gap-2 bg-black/30 border border-gray-700 rounded px-3 py-2 focus-within:border-blue-500 transition-colors">
                            <LinkIcon size={16} className="text-gray-500" />
                            <input 
                                type="url"
                                className="w-full bg-transparent text-white focus:outline-none"
                                placeholder="https://..."
                                value={link} onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Tech Stack (comma separated)</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="React, Node.js, MongoDB"
                            value={tags} onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium">Add Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
