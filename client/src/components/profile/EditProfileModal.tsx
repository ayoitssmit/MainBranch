"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { X, Loader2, Plus, X as XIcon } from 'lucide-react';

interface EditProfileModalProps {
    user: any;
    onClose: () => void;
    onUpdate: () => void;
}

export default function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
    const [bio, setBio] = useState(user.bio || '');
    const [displayName, setDisplayName] = useState(user.displayName || user.username || '');
    const [leetcodeUsername, setLeetcodeUsername] = useState(user.stats?.leetcode?.username || '');
    const [kaggleUsername, setKaggleUsername] = useState(user.stats?.kaggle?.username || '');
    const [huggingfaceUsername, setHuggingfaceUsername] = useState(user.stats?.huggingface?.username || '');
    const [blogUrl, setBlogUrl] = useState(user.socials?.blog || '');
    
    const [skills, setSkills] = useState<string[]>(user.skills || []);
    const [newSkill, setNewSkill] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Only send fields if they have values or are being cleared
            const payload: any = {
                bio,
                displayName,
                leetcodeUsername,
                kaggleUsername,
                huggingfaceUsername,
                blogUrl,
                skills
            };

            await axios.put('http://localhost:5000/api/users/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-[hsl(var(--ide-border))]">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Display Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Bio</label>
                        <textarea 
                            className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors min-h-[100px]"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Integrated Platforms */}
                    <div className="pt-2 border-t border-gray-800">
                        <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">Integrations</label>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">LeetCode Username</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                                    value={leetcodeUsername}
                                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                                    placeholder="username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Kaggle Username</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                                    value={kaggleUsername}
                                    onChange={(e) => setKaggleUsername(e.target.value)}
                                    placeholder="username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Hugging Face Username</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                                    value={huggingfaceUsername}
                                    onChange={(e) => setHuggingfaceUsername(e.target.value)}
                                    placeholder="username"
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Personal Blog URL</label>
                                <input 
                                    type="url" 
                                    className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                                    value={blogUrl}
                                    onChange={(e) => setBlogUrl(e.target.value)}
                                    placeholder="https://yourblog.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-800">
                         <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Skills</label>
                         <div className="flex gap-2 mb-2">
                             <input 
                                type="text"
                                className="flex-1 bg-black/30 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill (e.g. React)"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                             />
                             <button 
                                type="button"
                                onClick={handleAddSkill}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded"
                             >
                                 <Plus size={18} />
                             </button>
                         </div>
                         <div className="flex flex-wrap gap-2">
                             {skills.map(skill => (
                                 <span key={skill} className="inline-flex items-center gap-1 bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm border border-gray-700">
                                     {skill}
                                     <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                                         <XIcon size={14} />
                                     </button>
                                 </span>
                             ))}
                         </div>
                    </div>
                </form>
                
                <div className="p-4 border-t border-[hsl(var(--ide-border))] flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
