"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    initialIsRequested?: boolean;
    onFollowChange?: (newStatus: 'none' | 'following' | 'requested') => void;
}

export function FollowButton({ targetUserId, initialIsFollowing, initialIsRequested = false, onFollowChange }: FollowButtonProps) {
    const { user, refreshUser } = useAuth();
    const [status, setStatus] = useState<'none' | 'following' | 'requested'>(
        initialIsFollowing ? 'following' : (initialIsRequested ? 'requested' : 'none')
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStatus(initialIsFollowing ? 'following' : (initialIsRequested ? 'requested' : 'none'));
    }, [initialIsFollowing, initialIsRequested]);

    const handleFollowToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading || !user) return;
        setLoading(true);

        try {
            if (status === 'following') {
                // Unfollow
                await axios.put(`http://localhost:5000/api/users/${targetUserId}/unfollow`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStatus('none');
                if (onFollowChange) onFollowChange('none');
            } else if (status === 'requested') {
                 // Cancel Request
                 await axios.put(`http://localhost:5000/api/users/${targetUserId}/unfollow`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }); // Same endpoint handles cancel
                setStatus('none');
                if (onFollowChange) onFollowChange('none');
            } else {
                // Follow
                 const res = await axios.put(`http://localhost:5000/api/users/${targetUserId}/follow`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.data.status === 'requested') {
                    setStatus('requested');
                    if (onFollowChange) onFollowChange('requested');
                } else {
                    setStatus('following');
                    if (onFollowChange) onFollowChange('following');
                }
            }
            refreshUser(); 
        } catch (error) {
            console.error('Failed to toggle follow status', error);
        } finally {
            setLoading(false);
        }
    };

    if (user?._id === targetUserId) return null; 

    return (
        <button
            onClick={handleFollowToggle}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                status !== 'none'
                ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/30' 
                : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 shadow-md shadow-orange-900/20'
            }`}
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 
             status === 'following' ? <><UserCheck size={14} /> Following</> : 
             status === 'requested' ? <><UserCheck size={14} className="opacity-50" /> Requested</> :
             <><UserPlus size={14} /> Follow</>}
        </button>
    );
}
