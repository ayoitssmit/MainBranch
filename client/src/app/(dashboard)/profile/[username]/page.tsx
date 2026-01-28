"use client";

import React, { useEffect, useState } from 'react';
import api, { BASE_URL } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Calendar, Linkedin, Code, Award, Briefcase, Users, UserCheck, MessageCircle, FileText, Settings } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useRouter, useParams } from 'next/navigation';
import { FollowButton } from '@/components/shared/FollowButton';

import ProjectList from '@/components/profile/ProjectList';
import CertificateList from '@/components/profile/CertificateList';
import StatsOverview from '@/components/profile/StatsOverview';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import UserListModal from '@/components/profile/UserListModal';
import PinnedShowcase from '@/components/profile/PinnedShowcase';
import PostCard from '@/components/feed/PostCard';

export default function PublicProfilePage() {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // Modal state for followers/following
    const [showUserListModal, setShowUserListModal] = useState(false);
    const [userListModalTitle, setUserListModalTitle] = useState('');
    const [userListModalUsers, setUserListModalUsers] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get(`/users/${username}`);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchUser();
    }, [username]);

    // Fetch posts when active tab is 'posts' and user is loaded
    useEffect(() => {
        const fetchPosts = async () => {
            if (activeTab === 'posts' && user?._id) {
                setPostsLoading(true);
                try {
                    const { data } = await api.get(`/posts/user/${user._id}`);
                    setPosts(data);
                } catch (error) {
                    console.error("Failed to fetch posts", error);
                } finally {
                    setPostsLoading(false);
                }
            }
        };

        fetchPosts();
    }, [activeTab, user?._id]);

    const handleShowFollowers = () => {
        setUserListModalTitle('Followers');
        setUserListModalUsers(user.followers || []);
        setShowUserListModal(true);
    };

    const handleShowFollowing = () => {
        setUserListModalTitle('Following');
        setUserListModalUsers(user.following || []);
        setShowUserListModal(true);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                User not found
            </div>
        );
    }

    const isMe = currentUser?._id === user._id;

    return (
        <div className="h-full overflow-y-auto bg-[hsl(var(--ide-bg))] relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-cyan-900/20 via-[hsl(var(--ide-bg))] to-[hsl(var(--ide-bg))] pointer-events-none" />

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
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium">
                                    {user.headline || "Developer"}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-400 font-medium mb-4">@{user.username}</p>

                        <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
                            {user.bio || "Crafting digital experiences."}
                        </p>

                        {/* Actions (Follow / Message) */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {!isMe && (
                                <>
                                    <FollowButton
                                        targetUserId={user._id}
                                        initialIsFollowing={currentUser?.following?.some((u: any) => u._id === user._id) || false}
                                        initialIsRequested={!!(currentUser && user.followRequests?.includes(currentUser._id))}
                                    />
                                    <button
                                        onClick={() => router.push(`/messages?userId=${user._id}`)}
                                        className="px-4 py-2 bg-[hsl(var(--secondary))] text-white rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-2 font-medium text-sm"
                                    >
                                        <MessageCircle size={16} /> Message
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('posts')}
                                        className="px-4 py-2 bg-[hsl(var(--secondary))] text-white rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-2 font-medium text-sm"
                                    >
                                        <FileText size={16} /> Posts
                                    </button>
                                </>
                            )}
                            
                            {isMe && (
                                <button
                                    onClick={() => router.push('/settings')}
                                    className="px-4 py-2 bg-[hsl(var(--secondary))] text-white rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-2 font-medium text-sm"
                                >
                                    <Settings size={16} /> Edit Profile
                                </button>
                            )}

                            {/* Social Icons */}
                            {user.socials?.github && (
                                <a href={user.socials.github} target="_blank" className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md border border-gray-700 transition-colors">
                                    <SiGithub size={18} />
                                </a>
                            )}
                            {user.socials?.linkedin && (
                                <a href={user.socials.linkedin} target="_blank" className="p-2 bg-cyan-900/20 hover:bg-cyan-900/30 text-cyan-400 rounded-md border border-cyan-900/30 transition-colors">
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="w-full max-w-5xl mb-8 border-b border-[hsl(var(--ide-border))]">
                    <div className="flex gap-8">
                        {['Profile', 'Stats', 'Projects', 'Certificates', 'Posts'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab.toLowerCase()
                                    ? 'text-cyan-400'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="w-full max-w-5xl min-h-[400px]">
                    {activeTab === 'profile' && (
                        <>
                            {/* GitHub Contribution Heatmap - First */}
                            <div className="w-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ActivityHeatmap username={user.username} />
                            </div>

                            {/* Pinned Showcase - Between Heatmap and Impact */}
                            <div className="w-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <PinnedShowcase
                                    pinnedItems={user.developerProfile?.pinnedItems || []}
                                    isOwnProfile={false}
                                />
                            </div>

                            {/* Impact & Expertise Grid - Second */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stats */}
                                <div className="bg-[hsl(var(--ide-sidebar))]/50 backdrop-blur-md border border-[hsl(var(--ide-border))] rounded-lg p-6 hover:border-gray-600 transition-colors">
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-sm bg-cyan-500" /> Impact
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Followers */}
                                        <div
                                            onClick={handleShowFollowers}
                                            className="p-4 rounded-md bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">{user.followers?.length || 0}</div>
                                                <Users size={18} className="text-cyan-500 opacity-60" />
                                            </div>
                                            <div className="text-xs text-cyan-200/60 font-medium uppercase tracking-wide">Followers</div>
                                        </div>

                                        {/* Following */}
                                        <div
                                            onClick={handleShowFollowing}
                                            className="p-4 rounded-md bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{user.following?.length || 0}</div>
                                                <UserCheck size={18} className="text-emerald-500 opacity-60" />
                                            </div>
                                            <div className="text-xs text-emerald-200/60 font-medium uppercase tracking-wide">Following</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="lg:col-span-2 bg-[hsl(var(--ide-sidebar))]/50 backdrop-blur-md border border-[hsl(var(--ide-border))] rounded-lg p-6 hover:border-gray-600 transition-colors flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-sm bg-[hsl(var(--accent))]" /> Expertise
                                        </h3>
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
                                            <div className="text-gray-500 text-sm">No skills listed.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'stats' && <StatsOverview user={user} />}

                    {activeTab === 'projects' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ProjectList projects={user.projects} isOwner={isMe} userId={user._id} />
                        </div>
                    )}

                    {activeTab === 'certificates' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CertificateList certificates={user.certificates} isOwner={isMe} />
                        </div>
                    )}

                    {activeTab === 'posts' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-4">
                            {postsLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
                                </div>
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onPostDeleted={(postId) => setPosts(prev => prev.filter(p => p._id !== postId))}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    No posts yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* User List Modal */}
            <UserListModal
                isOpen={showUserListModal}
                onClose={() => setShowUserListModal(false)}
                title={userListModalTitle}
                users={userListModalUsers}
            />
        </div>
    );
}
