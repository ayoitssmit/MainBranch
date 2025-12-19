import React from 'react';
import { Trophy, Star, GitBranch, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeveloperStatsProps {
    stats: {
        github?: {
            followers: number;
            following: number;
            public_repos: number;
            total_stars: number;
            languages?: Record<string, number>;
            last_synced?: string;
        };
        leetcode?: {
            username: string;
            ranking: number;
            total_solved: number;
            easy_solved: number;
            medium_solved: number;
            hard_solved: number;
            last_synced?: string;
        };
    };
}

const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    PHP: '#4F5D95',
    Ruby: '#701516',
    // Fallback
    Other: '#ededed'
};

export default function DeveloperStats({ stats }: DeveloperStatsProps) {
    const { github, leetcode } = stats;

    const renderLanguageBar = () => {
        if (!github?.languages) return null;
        
        const total = Object.values(github.languages).reduce((a, b) => a + b, 0);
        if (total === 0) return <p className="text-gray-500 text-sm">No language data found.</p>;

        const sortedLangs = Object.entries(github.languages)
            .sort(([, a], [, b]) => b - a);

        const topLangs = sortedLangs.slice(0, 5);
        const otherCount = sortedLangs.slice(5).reduce((acc, [, count]) => acc + count, 0);
        
        if (otherCount > 0) {
            topLangs.push(['Other', otherCount]);
        }

        return (
            <div className="space-y-4">
                <div className="flex h-3 rounded-sm overflow-hidden bg-gray-800/50 w-full">
                    {topLangs.map(([lang, count]) => {
                        const percentage = (count / total) * 100;
                        if (percentage < 1) return null; // Don't show tiny slivers
                        return (
                            <div 
                                key={lang} 
                                style={{ width: `${percentage}%`, backgroundColor: LANGUAGE_COLORS[lang] || '#9ca3af' }}
                                title={`${lang}: ${Math.round(percentage)}%`}
                                className="h-full hover:brightness-110 transition-all"
                            />
                        );
                    })}
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {topLangs.map(([lang, count]) => {
                         const percentage = Math.round((count / total) * 100);
                         if (percentage < 1 && lang !== 'Other') return null;

                         return (
                            <div key={lang} className="flex items-center gap-2 text-xs">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: LANGUAGE_COLORS[lang] || '#9ca3af' }} />
                                <span className="font-medium text-gray-200">{lang}</span>
                                <span className="text-gray-500">{percentage}%</span>
                            </div>
                         );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LeetCode Stats */}
            <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg p-5">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" /> LeetCode
                    </h3>
                    {leetcode?.username && <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">@{leetcode.username}</span>}
                </div>

                {leetcode ? (
                    <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-bold text-white">{leetcode.total_solved}</p>
                                <p className="text-xs text-gray-400">Total Solved</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-300">Rank: #{leetcode.ranking?.toLocaleString() || 'N/A'}</p>
                            </div>
                         </div>
                         
                         {/* Difficulty Bars */}
                         <div className="space-y-3 mt-4">
                            {/* Easy */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Easy</span>
                                    <span>{leetcode.easy_solved}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${leetcode.total_solved ? (leetcode.easy_solved / leetcode.total_solved) * 100 : 0}%` }} />
                                </div>
                            </div>
                             {/* Medium */}
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Medium</span>
                                    <span>{leetcode.medium_solved}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${leetcode.total_solved ? (leetcode.medium_solved / leetcode.total_solved) * 100 : 0}%` }} />
                                </div>
                            </div>
                             {/* Hard */}
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Hard</span>
                                    <span>{leetcode.hard_solved}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-red-500 rounded-full" style={{ width: `${leetcode.total_solved ? (leetcode.hard_solved / leetcode.total_solved) * 100 : 0}%` }} />
                                </div>
                            </div>
                         </div>
                    </div>
                ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-500 text-sm">
                        <p>No LeetCode data linked.</p>
                        <p className="text-xs mt-1">Go to Settings to sync.</p>
                    </div>
                )}
            </div>

            {/* GitHub Stats */}
            <div className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-lg p-5">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Code2 size={18} className="text-[hsl(var(--accent))]" /> GitHub
                    </h3>
                </div>

                {github ? (
                     <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-black/20 p-3 rounded text-center">
                                <GitBranch size={16} className="text-blue-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{github.public_repos}</p>
                                <p className="text-[10px] text-gray-500">Repos</p>
                            </div>
                            <div className="bg-black/20 p-3 rounded text-center">
                                <Star size={16} className="text-yellow-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{github.total_stars}</p>
                                <p className="text-[10px] text-gray-500">Stars</p>
                            </div>
                            <div className="bg-black/20 p-3 rounded text-center">
                                <span className="text-xs font-bold block mb-1.5 text-green-400">Followers</span>
                                <p className="text-lg font-bold text-white">{github.followers}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Languages</h4>
                            {renderLanguageBar()}
                        </div>
                     </div>
                ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-500 text-sm">
                        <p>No GitHub data found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
