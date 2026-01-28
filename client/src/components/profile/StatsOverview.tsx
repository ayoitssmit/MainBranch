import React from 'react';
import { RefreshCw } from 'lucide-react';
import { SiGithub, SiLeetcode, SiHuggingface } from 'react-icons/si';
import { FaKaggle } from 'react-icons/fa';
import LeetCodeStatsCard from './LeetCodeStatsCard';

interface StatsOverviewProps {
    user: any;
}

const StatCard = ({ title, icon: Icon, color, children, connected }: any) => (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
                <Icon size={20} />
            </div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            {connected && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">Connected</span>}
        </div>
        {children}
    </div>
);

export default function StatsOverview({ user }: StatsOverviewProps) {
    if (!user) return null;

    const integrations = user.integrations || {};
    // Map integration stats to a common stats object for easier access
    const stats = {
        github: user?.stats?.github || integrations.github?.stats,
        leetcode: user?.stats?.leetcode || integrations.leetcode?.stats,
        kaggle: user?.stats?.kaggle || integrations.kaggle?.stats,
        huggingface: user?.stats?.huggingface || integrations.huggingface?.stats,
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* GitHub Stats */}
                <StatCard title="GitHub" icon={SiGithub} color="gray" connected={!!integrations.github?.username}>
                    {stats.github ? (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Public Repos</div>
                                    <div className="text-2xl font-bold text-foreground">{stats.github.public_repos || 0}</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Stars</div>
                                    <div className="text-2xl font-bold text-foreground">{stats.github.total_stars || 0}</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Followers</div>
                                    <div className="text-2xl font-bold text-foreground">{stats.github.followers || 0}</div>
                                </div>
                            </div>
                        </div>
                    ) : (integrations.github?.username ? (
                        <div className="text-sm text-yellow-500 flex items-center gap-2">
                            <RefreshCw size={14} className="animate-spin" /> Data sync required.
                        </div>
                    ) : <div className="text-muted-foreground text-sm">Not connected</div>)}
                </StatCard>

                {/* LeetCode Stats */}
                <StatCard title="LeetCode" icon={SiLeetcode} color="yellow" connected={!!integrations.leetcode?.username}>
                    {stats.leetcode ? (
                        <LeetCodeStatsCard stats={stats.leetcode} username={integrations.leetcode?.username || ''} />
                    ) : (integrations.leetcode?.username ? (
                        <div className="text-sm text-yellow-500 flex items-center gap-2">
                            <RefreshCw size={14} /> Data sync required.
                        </div>
                    ) : <div className="text-muted-foreground text-sm">Not connected</div>)}
                </StatCard>

                {/* Kaggle Stats */}
                <StatCard title="Kaggle" icon={FaKaggle} color="cyan" connected={!!integrations.kaggle?.username}>
                    {stats.kaggle ? (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Datasets</div>
                                    <div className="text-xl font-bold text-foreground">{stats.kaggle.datasets || 0}</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Competitions</div>
                                    <div className="text-xl font-bold text-foreground">{stats.kaggle.competitions || 0}</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Notebooks</div>
                                    <div className="text-xl font-bold text-foreground">{stats.kaggle.kernels || 0}</div>
                                </div>
                            </div>
                        </div>
                    ) : (integrations.kaggle?.username ? (
                        <div className="text-sm text-yellow-500 flex items-center gap-2">
                            <RefreshCw size={14} /> Data sync required.
                        </div>
                    ) : <div className="text-muted-foreground text-sm">Not connected</div>)}
                </StatCard>

                {/* Hugging Face Stats */}
                <StatCard title="Hugging Face" icon={SiHuggingface} color="amber" connected={!!integrations.huggingface?.username}>
                    {stats.huggingface ? (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Models Published</div>
                                    <div className="text-xl font-bold text-foreground">{stats.huggingface.models_count || 0}</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Total Model Downloads</div>
                                    <div className="text-xl font-bold text-foreground">{stats.huggingface.total_downloads || 0}</div>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded border border-border flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground uppercase">Spaces Created</div>
                                    <div className="text-xl font-bold text-foreground">{stats.huggingface.spaces_count || 0}</div>
                                </div>
                            </div>
                        </div>
                    ) : (integrations.huggingface?.username ? (
                        <div className="text-sm text-yellow-500 flex items-center gap-2">
                            <RefreshCw size={14} /> Data sync required.
                        </div>
                    ) : <div className="text-muted-foreground text-sm">Not connected</div>)}
                </StatCard>
            </div>
        </div>
    );
}
