import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
    };
    createdAt: string;
    upvotes: string[];
    parentComment?: string;
    children?: Comment[];
}

interface CommentThreadProps {
    comment: Comment;
    depth?: number;
    userId?: string;
    onVote: (commentId: string) => void;
    onReply: (commentId: string, content: string) => Promise<void>;
    onDelete: (commentId: string, parentCommentId?: string) => Promise<void>;
}

export default function CommentThread({
    comment,
    depth = 0,
    userId,
    onVote,
    onReply,
    onDelete
}: CommentThreadProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isLiked = userId && comment.upvotes?.includes(userId);
    const canDelete = userId && comment.author && comment.author._id?.toString() === userId.toString();

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onReply(comment._id, replyContent);
            setIsReplying(false);
            setReplyContent('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`flex flex-col ${depth > 0 ? 'mt-3' : 'mt-4'}`}>
            <div className="flex gap-2 relative group">

                {/* Thread Line - Only show if not top level or if strictly adhering to design, usually reddit has lines for children */}
                {depth > 0 && (
                    <div className="absolute -left-[19px] top-8 bottom-0 w-px bg-gray-700/50 group-hover:bg-gray-600 transition-colors" />
                )}

                {/* Avatar / Collapse Control */}
                <div className="flex flex-col items-center">
                    <Link href={`/profile/${comment.author?.username}`} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={comment.author?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.author?.username}`}
                            className="w-7 h-7 rounded-full border border-gray-700 bg-black object-cover z-10 relative"
                            alt="avatar"
                        />
                    </Link>
                    {/* Thread Line extending down from avatar to children */}
                    {!isCollapsed && comment.children && comment.children.length > 0 && (
                        <div className="w-0.5 flex-1 bg-gray-800 group-hover:bg-gray-700 transition-colors my-1 rounded-full cursor-pointer"
                            onClick={() => setIsCollapsed(true)}
                        />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-xs mb-1">
                        <Link
                            href={`/profile/${comment.author?.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-gray-300 hover:text-white transition-colors"
                        >
                            {comment.author?.displayName || comment.author?.username}
                        </Link>
                        {comment.author?._id === userId && (
                            <span className="text-[10px] text-cyan-500 font-bold bg-cyan-950/30 px-1 rounded">OP</span>
                        )}
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                    </div>

                    {/* Body */}
                    <div className="text-sm text-gray-200 leading-snug break-words mb-1 pr-4" onClick={(e) => e.stopPropagation()}>
                        {comment.content}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 select-none">
                        {/* Vote */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => onVote(comment._id)}
                                className={`hover:text-orange-500 hover:bg-white/5 p-1 -ml-1 rounded transition-colors ${isLiked ? 'text-orange-500' : ''}`}
                            >
                                <ThumbsUp size={14} className={isLiked ? "fill-current" : ""} />
                            </button>
                            <span className={isLiked ? 'text-orange-500' : ''}>
                                {comment.upvotes?.length || 0}
                            </span>
                        </div>

                        {/* Reply */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsReplying(!isReplying); }}
                            className="flex items-center gap-1 hover:bg-white/5 p-1 rounded transition-colors"
                        >
                            <MessageSquare size={14} />
                            <span>Reply</span>
                        </button>

                        {/* Share (Placeholder) */}
                        <button className="flex items-center gap-1 hover:bg-white/5 p-1 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                            <span>Share</span>
                        </button>

                        {/* Delete */}
                        {canDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(comment._id, comment.parentComment); }}
                                className="flex items-center gap-1 hover:bg-white/5 p-1 rounded transition-colors hover:text-red-400"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-3 mb-2" onClick={(e) => e.stopPropagation()}>
                            <div className="relative">
                                <textarea // Changed to textarea for better UX
                                    className="w-full bg-black/30 border border-gray-700 rounded-md py-2 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all font-mono min-h-[80px] resize-y"
                                    placeholder="What are your thoughts?"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="bg-transparent hover:bg-white/10 text-gray-300 text-xs font-bold py-1.5 px-3 rounded-full transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !replyContent.trim()}
                                    className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 text-xs font-bold py-1.5 px-3 rounded-full transition-colors"
                                >
                                    Reply
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Children */}
                    {!isCollapsed && comment.children && comment.children.length > 0 && (
                        <div className="ml-1 pl-4 border-l-2 border-transparent hover:border-gray-700/50 transition-colors">
                            {comment.children.map((child) => (
                                <CommentThread
                                    key={child._id}
                                    comment={child}
                                    depth={depth + 1}
                                    userId={userId}
                                    onVote={onVote}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
