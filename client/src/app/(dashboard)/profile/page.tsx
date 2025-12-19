"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Calendar, MapPin, ExternalLink, Github, Linkedin, Code, Award, Briefcase, Users, UserCheck, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-full overflow-y-auto bg-[hsl(var(--ide-bg))] relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900/20 via-[hsl(var(--ide-bg))] to-[hsl(var(--ide-bg))] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto p-8 relative z-10 flex flex-col items-center">
                
                {/* Hero Profile Card */}
                <div className="w-full max-w-5xl bg-[hsl(var(--ide-sidebar))]/50 border border-[hsl(var(--ide-border))] rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    
                    {/* Avatar - Squarish Round */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-xl p-1 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
                            <div className="w-full h-full rounded-lg overflow-hidden bg-[hsl(var(--ide-bg))] border-2 border-[hsl(var(--ide-bg))]">
                                <img 
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-2">
                            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                                {user.displayName || user.username}
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-sm" title="Online" />
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                                    {user.headline || "Full Stack Developer"}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-400 font-medium mb-4">@{user.username}</p>

                        <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
                            {user.bio || "Crafting digital experiences."}
                        </p>

                        {/* Socials - Horizontal Left Aligned */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                             {user.socials?.github && (
                                <a href={user.socials.github} target="_blank" className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md border border-gray-700 transition-colors">
                                    <Github size={18} />
                                </a>
                            )}
                            {user.socials?.linkedin && (
                                <a href={user.socials.linkedin} target="_blank" className="p-2 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 rounded-md border border-blue-900/30 transition-colors">
                                    <Linkedin size={18} />
                                </a>
                            )}
                             <a href={`mailto:${user.email}`} className="p-2 bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 rounded-md border border-emerald-900/30 transition-colors">
                                    <Mail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats & Skills Grid */}
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Stats */}
                    <div className="bg-[hsl(var(--ide-sidebar))]/50 backdrop-blur-md border border-[hsl(var(--ide-border))] rounded-lg p-6 hover:border-gray-600 transition-colors">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-sm bg-blue-500" /> Impact
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Followers */}
                            <div className="p-4 rounded-md bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-colors group">
                                <div className="flex items-start justify-between mb-2">
                                     <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{user.stats?.github?.followers || 0}</div>
                                     <Users size={18} className="text-blue-500 opacity-60" />
                                </div>
                                <div className="text-xs text-blue-200/60 font-medium uppercase tracking-wide">Followers</div>
                            </div>

                            {/* Following */}
                            <div className="p-4 rounded-md bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
                                <div className="flex items-start justify-between mb-2">
                                     <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">{user.stats?.github?.following || 0}</div>
                                     <UserCheck size={18} className="text-purple-500 opacity-60" />
                                </div>
                                <div className="text-xs text-purple-200/60 font-medium uppercase tracking-wide">Following</div>
                            </div>

                            {/* Projects */}
                            <div className="p-4 rounded-md bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group">
                                <div className="flex items-start justify-between mb-2">
                                     <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{user.projects?.length || 0}</div>
                                     <Code size={18} className="text-emerald-500 opacity-60" />
                                </div>
                                <div className="text-xs text-emerald-200/60 font-medium uppercase tracking-wide">Projects</div>
                            </div>

                             {/* Certificates */}
                             <div className="p-4 rounded-md bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-colors group">
                                <div className="flex items-start justify-between mb-2">
                                     <div className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">{user.certificates?.length || 0}</div>
                                     <Award size={18} className="text-amber-500 opacity-60" />
                                </div>
                                <div className="text-xs text-amber-200/60 font-medium uppercase tracking-wide">Certificates</div>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="lg:col-span-2 bg-[hsl(var(--ide-sidebar))]/50 backdrop-blur-md border border-[hsl(var(--ide-border))] rounded-lg p-6 hover:border-gray-600 transition-colors flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-sm bg-[hsl(var(--accent))]" /> Expertise
                            </h3>
                            <button 
                                onClick={() => router.push('/settings')} // Redirect to settings to add skills
                                className="w-8 h-8 flex items-center justify-center rounded-md bg-[hsl(var(--ide-bg))] border border-[hsl(var(--ide-border))] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex-1">
                            {user.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill: string) => (
                                        <span 
                                            key={skill} 
                                            className="px-3 py-1.5 bg-[hsl(var(--ide-bg))] text-gray-300 rounded-md border border-[hsl(var(--ide-border))] text-sm font-medium shadow-sm hover:border-gray-500 hover:text-white transition-colors cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full min-h-[120px] rounded-lg border-2 border-dashed border-gray-700/50 flex flex-col items-center justify-center text-center p-6 bg-black/10 hover:bg-black/20 transition-colors group cursor-pointer" onClick={() => router.push('/settings')}>
                                    <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-3">
                                        <Plus size={20} />
                                    </div>
                                    <p className="text-gray-400 font-medium group-hover:text-gray-300">Add your skills to get discovered</p>
                                    <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-500">Java, React, Python, etc.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Quick Actions */}
                         <div className="mt-8 pt-6 border-t border-[hsl(var(--ide-border))] grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <button 
                                onClick={() => router.push('/projects')}
                                className="flex items-center justify-between p-4 rounded-md bg-gradient-to-r from-blue-900/10 to-transparent border border-blue-900/20 hover:border-blue-500/30 group transition-all"
                            >
                                <span className="flex items-center gap-3 text-blue-200">
                                    <Briefcase size={18} /> View Projects
                                </span>
                                <ExternalLink size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </button>

                             <button 
                                onClick={() => router.push('/certificates')}
                                className="flex items-center justify-between p-4 rounded-md bg-gradient-to-r from-yellow-900/10 to-transparent border border-yellow-900/20 hover:border-yellow-500/30 group transition-all"
                            >
                                <span className="flex items-center gap-3 text-yellow-200">
                                    <Award size={18} /> View Certificates
                                </span>
                                <ExternalLink size={16} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </button>
                         </div>
                    </div>

                </div>
                
                 {/* Footer Info */}
                <div className="mt-12 text-center text-gray-600 text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar size={14} /> <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
