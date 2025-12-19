"use client";

import React from 'react';
import { Files, Search, GitGraph, Box, User, Settings, LayoutGrid, Bell, Briefcase, Award, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
    return (
        <div 
            className={cn(
                "w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 relative group rounded-md mx-2",
                isActive ? "text-white bg-white/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            )}
            onClick={onClick}
        >
            <Icon size={24} strokeWidth={1.5} />
            {/* Tooltip */}
            <div className="absolute left-14 bg-black border border-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {label}
            </div>
        </div>
    );
};

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-16 h-full bg-[hsl(var(--ide-activity))] flex flex-col items-center py-4 border-r border-[hsl(var(--ide-border))] z-50 gap-2">
            {/* 1. Feed */}
            <Link href="/feed">
                <SidebarItem 
                    icon={LayoutGrid} 
                    label="Feed" 
                    isActive={pathname === '/feed'} 
                />
            </Link>

            {/* 2. Explore / Search */}
            <Link href="/search">
                <SidebarItem 
                    icon={Search} 
                    label="Explore" 
                    isActive={pathname === '/search'} 
                />
            </Link>
            
            {/* 3. Profile */}
            <Link href="/profile">
                <SidebarItem 
                    icon={User} 
                    label="Profile" 
                    isActive={pathname === '/profile'} 
                />
            </Link>

            {/* 3. Stats */}
            <Link href="/stats">
                <SidebarItem 
                    icon={BarChart2} 
                    label="Stats" 
                    isActive={pathname === '/stats'} 
                />
            </Link>

            {/* 4. Notifications */}
            <Link href="/notifications">
                <SidebarItem 
                    icon={Bell} 
                    label="Notifications" 
                    isActive={pathname === '/notifications'} 
                />
            </Link>

             <div className="h-px w-8 bg-gray-800 my-2" />

             {/* 5. Projects */}
            <Link href="/projects">
                <SidebarItem 
                    icon={Briefcase} 
                    label="Projects" 
                    isActive={pathname === '/projects'} 
                />
            </Link>

            {/* 6. Certificates */}
            <Link href="/certificates">
                <SidebarItem 
                    icon={Award} 
                    label="Certificates" 
                    isActive={pathname === '/certificates'} 
                />
            </Link>

            {/* 7. Compose */}
             <Link href="/post/create">
                <SidebarItem 
                    icon={Files} 
                    label="Compose" 
                    isActive={pathname === '/post/create'} 
                />
            </Link>
            
            <div className="flex-1" /> {/* Spacer */}
            
            <Link href="/settings">
                <SidebarItem 
                    icon={Settings} 
                    label="Settings" 
                    isActive={pathname === '/settings'} 
                />
            </Link>
        </div>
    );
}
