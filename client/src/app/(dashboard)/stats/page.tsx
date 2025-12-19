"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, BarChart2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DeveloperStats from '@/components/profile/DeveloperStats';

export default function StatsPage() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    const handleSyncStats = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/users/sync-stats', {}, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            refreshUser();
            alert("Stats synced!");
        } catch (e) {
            alert("Sync failed");
        }
    }

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
    if (!user) return null;

    return (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-[hsl(var(--ide-border))]">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart2 className="text-[hsl(var(--accent))]" /> Developer Stats
                    </h1>
                    <p className="text-gray-400 mt-2">Live metrics from your coding activity.</p>
                </div>
                <button 
                    onClick={handleSyncStats} 
                    className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <RefreshCw size={18} /> Sync Data
                </button>
            </header>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DeveloperStats stats={user.stats || {}} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HuggingFace Detailed Card */}
                    <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🤗</span>
                            <h3 className="text-xl font-bold text-white">Hugging Face</h3>
                        </div>
                        {user.stats?.huggingface?.username ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-black/20 rounded-lg border border-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Username</span>
                                        <span className="text-white font-mono">@{user.stats.huggingface.username}</span>
                                    </div>
                                    {/* Mock extended stats since schema is basic currently */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Models</span>
                                        <span className="text-white font-mono">0</span>
                                    </div>
                                </div>
                                <a 
                                    href={user.socials?.huggingface} 
                                    target="_blank"
                                    className="block w-full text-center py-2 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                                >
                                    View Profile
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Not connected. Add your username in Edit Profile.
                            </div>
                        )}
                    </div>

                    {/* Kaggle Detailed Card */}
                    <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl text-blue-500 font-bold">K</span>
                            <h3 className="text-xl font-bold text-white">Kaggle</h3>
                        </div>
                        {user.stats?.kaggle?.username ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-black/20 rounded-lg border border-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Username</span>
                                        <span className="text-white font-mono">@{user.stats.kaggle.username}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Competitions</span>
                                        <span className="text-white font-mono">0</span>
                                    </div>
                                </div>
                                <a 
                                    href={user.socials?.kaggle} 
                                    target="_blank"
                                    className="block w-full text-center py-2 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                >
                                    View Profile
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Not connected. Add your username in Edit Profile.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
