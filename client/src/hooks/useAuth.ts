"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    username: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
    headline?: string;
    bio?: string;
    location?: string;
    website?: string;
    skills?: string[];
    createdAt?: string;
    
    // Arrays
    projects?: any[]; 
    certificates?: any[];
    
    // Social Links
    socials?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        blog?: string; // website alias
        kaggle?: string;
        huggingface?: string;
    };

    // Stats
    stats?: {
        github?: {
            followers: number;
            following: number;
            public_repos: number;
            total_stars: number;
            languages?: {[key: string]: number};
        };
        leetcode?: {
            username: string;
            ranking: number;
            total_solved: number;
            easy_solved?: number;
            medium_solved?: number;
            hard_solved?: number;
        };
        kaggle?: {
            username: string;
        };
        huggingface?: {
            username: string;
        };
    };
    
    // Social Graph
    followers?: string[];
    following?: string[];
    followRequests?: any[]; // Populated with User objects

    profileSections: any[];
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('userInfo');

            if (!token) {
                setLoading(false);
                return;
            }

            if (storedUser) {
                 setUser(JSON.parse(storedUser));
            }

            try {
                // Verify token and get fresh data
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setUser(response.data);
                localStorage.setItem('userInfo', JSON.stringify(response.data));
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userInfo');
                setUser(null);
                // Optional: router.push('/login'); 
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userInfo');
        setUser(null);
        router.push('/login');
    };

    const refreshUser = () => {
         // Re-trigger the checkAuth effect by some means or just expose checkAuth
         // Since checkAuth is inside useEffect, we can't export it directly without refactoring.
         // A simple way is to force a re-fetch or expose a method.
         // Better: Let's extract the fetch logic.
         const token = localStorage.getItem('token');
         if(token) {
            axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setUser(res.data);
                localStorage.setItem('userInfo', JSON.stringify(res.data));
            })
            .catch(err => console.error(err));
         }
    };

    return { user, loading, logout, refreshUser };
}
