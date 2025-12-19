"use client";

import React from 'react';

interface ActivitySidebarProps {
    user: any;
}

export default function ActivitySidebar({ user }: ActivitySidebarProps) {
     if (!user) return null;
     
    return (
        <aside className="hidden xl:block w-[300px] shrink-0 sticky top-6 h-fit space-y-4">
            <div>
                <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                        Activity
                </h3>
                <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg p-4 shadow-sm">
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 49 }).map((_, i) => (
                                <div 
                                key={i} 
                                className={`w-full aspect-square rounded-[1px] ${
                                    Math.random() > 0.8 ? 'bg-green-500' : 
                                    Math.random() > 0.5 ? 'bg-green-900/60' : 
                                    'bg-gray-800/50'
                                }`} 
                            />
                            ))}
                        </div>
                        <div className="mt-2 text-[10px] text-gray-500 flex justify-between px-1">
                            <span>Less</span>
                            <span>More</span>
                        </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                    Connected Accounts
                </h3>
                <div className="space-y-2">
                    {user.stats?.github?.username ? (
                        <div className="flex items-center gap-3 p-2.5 bg-[hsl(var(--ide-sidebar))] rounded-lg border border-[hsl(var(--ide-border))] hover:border-gray-600 transition-colors cursor-pointer">
                            <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">GitHub</div>
                                <div className="text-[10px] text-gray-500 truncate">@{user.stats.github.username || user.username}</div>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                    ) : null}
                    
                    <div className="flex items-center gap-3 p-2.5 bg-[hsl(var(--ide-sidebar))] rounded-lg border border-[hsl(var(--ide-border))] hover:border-gray-600 transition-colors cursor-pointer">
                            <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">LeetCode</div>
                                <div className="text-[10px] text-gray-500 truncate">{user.stats?.leetcode?.username ? `@${user.stats.leetcode.username}` : 'Not connected'}</div>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.stats?.leetcode?.username ? 'bg-green-500' : 'bg-gray-600'}`} />
                    </div>

                    <div className="flex items-center gap-3 p-2.5 bg-[hsl(var(--ide-sidebar))] rounded-lg border border-[hsl(var(--ide-border))] hover:border-gray-600 transition-colors cursor-pointer">
                            <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                                    <span className="text-blue-400 font-bold text-[10px]">K</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">Kaggle</div>
                                <div className="text-[10px] text-gray-500 truncate">{user.stats?.kaggle?.username ? `@${user.stats.kaggle.username}` : 'Not connected'}</div>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.stats?.kaggle?.username ? 'bg-green-500' : 'bg-gray-600'}`} />
                    </div>
                </div>
            </div>
        </aside>
    );
}
