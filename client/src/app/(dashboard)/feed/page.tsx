"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PostCard from '@/components/feed/PostCard';
import ProfileSidebar from '@/components/layout/ProfileSidebar';
import ActivitySidebar from '@/components/layout/ActivitySidebar';

interface Post {
  _id: string;
  content: string;
  slug: string;
  author: {
    _id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
    headline?: string;
  };
  createdAt: string;
  tags: string[];
  likes: string[];
  commentsCount: number;
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'following'>('discover');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'following' 
            ? 'http://localhost:5000/api/posts/following'
            : 'http://localhost:5000/api/posts';
            
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(endpoint, { headers });
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeTab]);

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const userPostCount = posts.filter((p) => p.author?._id === user?._id).length;

  return (
    <div className="h-full overflow-y-auto">
        <div className="max-w-[1200px] mx-auto py-6 px-4 flex flex-col md:flex-row gap-6 justify-center">
        
        {/* LEFT COLUMN: Profile Sidebar */}
        <div className="w-full md:w-auto">
             <ProfileSidebar user={user} postCount={userPostCount} />
        </div>

        {/* MIDDLE COLUMN: Feed */}
        <main className="flex-1 w-full max-w-[600px] min-w-0 mx-auto">
             
             {/* Feed Tabs */}
             <div className="flex gap-4 mb-4 border-b border-[hsl(var(--border))]">
                 <button 
                    onClick={() => setActiveTab('discover')}
                    className={`pb-2 px-1 text-sm font-bold transition-colors relative ${activeTab === 'discover' ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
                 >
                     Discover
                     {activeTab === 'discover' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--primary))]" />}
                 </button>
                 <button 
                    onClick={() => setActiveTab('following')}
                    className={`pb-2 px-1 text-sm font-bold transition-colors relative ${activeTab === 'following' ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
                 >
                     Following
                     {activeTab === 'following' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(var(--primary))]" />}
                 </button>
             </div>

             {/* Create Post Widget */}
            <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg p-3 mb-4">
                <div className="flex gap-3 items-center mb-2">
                <img
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'User'}`}
                    className="w-10 h-10 rounded-full border border-gray-700"
                    alt="Me"
                />
                <Link href="/post/create" className="flex-1">
                    <div className="w-full bg-black/20 hover:bg-black/30 border border-gray-700 hover:border-gray-600 rounded-full px-4 py-2.5 text-sm text-gray-400 font-medium transition-colors text-left cursor-text">
                    Start a post...
                    </div>
                </Link>
                </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
                 <div className="flex justify-center py-12">
                     <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={32} />
                 </div>
            ) : (
                <div className="space-y-3">
                    {posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-[hsl(var(--ide-sidebar))] rounded-lg border border-[hsl(var(--ide-border))] text-sm flex flex-col items-center">
                        <p className="mb-2">
                            {activeTab === 'following' ? "You aren't following anyone yet, or they haven't posted." : "No posts found."}
                        </p>
                        {activeTab === 'following' && (
                            <Link href="/search" className="text-[hsl(var(--primary))] hover:underline font-medium">
                                Find people to follow
                            </Link>
                        )}
                    </div>
                    ) : (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
                    ))
                    )}
                </div>
            )}
        </main>

        {/* RIGHT COLUMN: Activity Sidebar */}
        <div className="hidden lg:block w-[300px]">
            <ActivitySidebar user={user} />
        </div>
        </div>
    </div>
  );
}
