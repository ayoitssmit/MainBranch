"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

import { SocketProvider } from '@/context/SocketContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <div className="flex h-screen w-full bg-[hsl(var(--ide-bg))] text-white overflow-hidden">
        {/* Activity Bar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Editor Content */}
            <main className="flex-1 overflow-auto p-0 relative">
               {children}
            </main>
        </div>
      </div>
    </SocketProvider>
  );
}
