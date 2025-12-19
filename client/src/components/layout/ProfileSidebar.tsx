"use client";

import React from 'react';
import { Mail, Calendar, ExternalLink } from 'lucide-react';

interface ProfileSidebarProps {
    user: any;
    postCount: number;
}

export default function ProfileSidebar({ user, postCount }: ProfileSidebarProps) {
    if (!user) return null;
    
    return (
        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-6 h-fit space-y-4">
             <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg overflow-hidden flex flex-col items-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-4 border-[hsl(var(--ide-bg))] shadow-xl mb-3 -mt-2">
                    <img 
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <h1 className="text-xl font-bold text-white mb-0.5">{user.displayName || user.username}</h1>
                <p className="text-gray-400 text-xs mb-4">@{user.username}</p>
                <p className="text-gray-300 text-xs mb-5 leading-relaxed bg-[hsl(var(--ide-bg))] p-3 rounded-lg w-full border border-[hsl(var(--ide-border))] text-left">
                    {user.bio || "No bio available."}
                </p>
                
                {/* User Meta */}
                <div className="w-full space-y-2 mb-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                            <Mail size={14} /> <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                            <Calendar size={14} /> <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {user.socials?.blog && (
                            <a href={user.socials.blog} target="_blank" className="flex items-center gap-3 text-xs text-blue-400 hover:underline">
                                <ExternalLink size={14} /> <span className="truncate">Website</span>
                            </a>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="flex justify-around w-full py-3 border-y border-[hsl(var(--ide-border))] mb-5 bg-[hsl(var(--ide-bg))]/30 rounded">
                    <div className="text-center">
                        <div className="text-white font-bold text-base">{postCount}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="text-white font-bold text-base">{user.stats?.github?.followers || 0}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-white font-bold text-base">{user.stats?.github?.following || 0}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Following</div>
                    </div>
                </div>

                {/* Skills */}
                <div className="w-full text-left">
                    <h3 className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                            {user.skills && user.skills.length > 0 ? (
                            user.skills.map((skill: string) => (
                                <span key={skill} className="bg-blue-900/10 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-800/30">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-xs italic">No skills added.</span>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
