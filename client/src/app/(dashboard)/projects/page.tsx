"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Briefcase, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProjectsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [localProjects, setLocalProjects] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user && user.projects) {
            setLocalProjects(user.projects);
        }
    }, [loading, user, router]);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
    if (!user) return null;

    return (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-[hsl(var(--ide-border))]">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="text-blue-500" /> My Projects
                    </h1>
                    <p className="text-gray-400 mt-2">Manage and showcase your portfolio.</p>
                </div>
                <button 
                    onClick={() => router.push('/project/create')} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Add Project
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localProjects.length > 0 ? (
                    localProjects.map((proj: any, idx: number) => (
                        <div 
                            key={idx}
                            onClick={() => router.push(`/project/${user._id}/${proj._id}`)}
                            className="group relative bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col"
                        >
                            <div className="h-32 bg-gradient-to-br from-gray-800 to-black relative">
                                {proj.image ? (
                                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                                        <Briefcase size={32} opacity={0.2} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-2 bg-black/60 backdrop-blur rounded-lg text-white hover:bg-blue-600 transition-colors">
                                        <ExternalLink size={16} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">{proj.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                                    {proj.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {proj.tags?.map((tag: string) => (
                                        <span key={tag} className="text-[11px] font-medium bg-blue-900/10 text-blue-300 px-2 py-1 rounded border border-blue-800/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-[hsl(var(--ide-border))] rounded-xl bg-[hsl(var(--ide-sidebar))]/30">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-6">Start building your portfolio by adding your first project.</p>
                        <button 
                            onClick={() => router.push('/project/create')}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors font-medium border border-white/10"
                        >
                            Create Project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
