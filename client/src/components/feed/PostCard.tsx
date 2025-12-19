"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Send, Globe, MoreHorizontal, Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

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
  image?: string; 
}

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

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export default function PostCard({ post: initialPost, onPostDeleted }: PostCardProps) {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentTree, setCommentTree] = useState<any[]>([]);

  useEffect(() => {
    if (comments.length) {
      setCommentTree(buildCommentTree(comments));
    }
  }, [comments]);

  const buildCommentTree = (flatComments: Comment[]) => {
    const map: Record<string, Comment> = {};
    const roots: Comment[] = [];
    flatComments.forEach((c) => {
      c.children = [];
      map[c._id] = c;
    });
    flatComments.forEach((c) => {
      if (c.parentComment) {
        const parent = map[c.parentComment];
        if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(c);
        }
      } else {
        roots.push(c);
      }
    });
    return roots;
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isCommentLiked = user && comment.upvotes?.includes(user._id);
    const canDelete = user && comment.author && comment.author._id?.toString() === user._id.toString();
    return (
      <div key={comment._id} className="flex gap-2" style={{ marginLeft: depth * 20 }}>
        <img
          src={comment.author?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.author?.username}`}
          className="w-8 h-8 rounded-full mt-1 border border-gray-700"
          alt="avatar"
        />
        <div className="flex-1">
          <div className="bg-gray-800/50 rounded-md p-2.5 inline-block min-w-[200px]">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white text-xs hover:underline cursor-pointer">
                {comment.author?.displayName || comment.author?.username}
              </span>
              <span className="text-[10px] text-gray-500 ml-2">
                {formatDistanceToNow(new Date(comment.createdAt))}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-snug break-words">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1 ml-1 text-[11px] text-gray-500 font-medium">
            <button
              onClick={() => handleCommentVote(comment._id)}
              className={`hover:text-blue-400 hover:underline transition-colors ${isCommentLiked ? 'text-blue-500' : ''}`}
            >
              Like{comment.upvotes?.length > 0 && <span className="ml-1">{comment.upvotes.length}</span>}
            </button>
            <span>|</span>
            <button
              className="hover:text-blue-400 hover:underline transition-colors"
              onClick={() => setReplyingTo(comment._id)}
            >
              Reply
            </button>
            {canDelete && (
              <button
                className="hover:text-red-400 hover:underline transition-colors"
                onClick={() => handleDeleteComment(comment._id, comment.parentComment)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          {replyingTo === comment._id && (
            <form onSubmit={handleReplySubmit} className="mt-2 flex items-center gap-2">
              <input
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-1 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button
                type="submit"
                className="text-blue-500 hover:text-blue-400 disabled:opacity-50"
                disabled={isSubmittingComment}
              >
                Send
              </button>
            </form>
          )}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-2">
              {comment.children.map((child) => renderComment(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleLike = async () => {
    if (!user) return;
    const isLiked = post.likes?.includes(user._id);
    const newLikes = isLiked ? post.likes.filter((id) => id !== user._id) : [...(post.likes || []), user._id];
    setPost({ ...post, likes: newLikes });
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Like failed', error);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      setShowComments(true);
      if (comments.length === 0) {
        setCommentsLoading(true);
        try {
          const { data } = await axios.get(`http://localhost:5000/api/posts/${post._id}/comments`);
          setComments(data);
        } catch (error) {
          console.error('Failed to fetch comments', error);
        } finally {
          setCommentsLoading(false);
        }
      }
    } else {
      setShowComments(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/posts/${post._id}/comments`, { content: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setComments([data, ...comments]);
      setNewComment('');
      setPost({ ...post, commentsCount: (post.commentsCount || 0) + 1 });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim() || !replyingTo) return;
    setIsSubmittingComment(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/posts/${post._id}/comments`, { content: replyContent, parentComment: replyingTo }, { headers: { Authorization: `Bearer ${token}` } });
      setComments([data, ...comments]);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Reply submit error:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentVote = async (commentId: string) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/posts/comments/${commentId}/vote`, { type: 'upvote' }, { headers: { Authorization: `Bearer ${token}` } });
      setComments(comments.map((c) => (c._id === commentId ? data : c)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (error) {
      console.error('Delete post error:', error);
    }
  };

  const handleDeleteComment = async (commentId: string, parentCommentId?: string) => {
    if (!user) return;
    
    const getDescendantIds = (parentId: string, allComments: any[]): string[] => {
      const children = allComments.filter(c => c.parentComment === parentId);
      let ids = children.map(c => c._id);
      children.forEach(child => {
        ids = [...ids, ...getDescendantIds(child._id, allComments)];
      });
      return ids;
    };

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${post._id}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      
      const idsToRemove = [commentId, ...getDescendantIds(commentId, comments)];
      const filtered = comments.filter((c) => !idsToRemove.includes(c._id));
      setComments(filtered);
      
      if (!parentCommentId) {
        setPost({ ...post, commentsCount: Math.max((post.commentsCount || 1) - 1, 0) });
      }
    } catch (error: any) {
      console.error('Delete comment error:', error);
      if (error.response && error.response.status === 404) {
         const idsToRemove = [commentId, ...getDescendantIds(commentId, comments)];
         const filtered = comments.filter((c) => !idsToRemove.includes(c._id));
         setComments(filtered);
      }
    }
  };

  const isLiked = user && post.likes?.includes(user._id);
  const canDeletePost = user && post.author && post.author._id?.toString() === user._id.toString();

  return (
    <article className="bg-[hsl(var(--ide-sidebar))] border border-[hsl(var(--ide-border))] rounded-md overflow-hidden mb-3">
      {/* Header */}
      <div className="p-3 flex gap-3 text-sm relative">
        <img
          src={post.author.avatarUrl || `https://ui-avatars.com/api/?name=${post.author.username}`}
          alt={post.author.username}
          className="w-10 h-10 rounded-full border border-gray-700"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="mr-6">
              <Link href={`/post/${post.slug || post._id}`} className="font-semibold text-white leading-tight hover:text-blue-400 hover:underline cursor-pointer truncate block">
                {post.author.displayName || post.author.username}
              </Link>
              <p className="text-[11px] text-gray-400 truncate leading-snug">Full Stack Developer</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                <Link href={`/post/${post.slug || post._id}`} className="hover:underline">
                  {formatDistanceToNow(new Date(post.createdAt))}
                </Link>
                <span>•</span>
                <Globe size={10} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canDeletePost && (
                <button className="text-red-400 hover:text-red-300" onClick={handleDeletePost}>
                  <Trash2 size={18} />
                </button>
              )}
              <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-2 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>

      {post.image && (
        <div className="mt-2 mb-2">
            <img 
                src={`http://localhost:5000${post.image}`} 
                alt="Post content" 
                className="w-full h-auto object-cover max-h-[500px] border-y border-gray-800/50"
            />
        </div>
      )}



      {/* Action Buttons */}
      <div className="px-1 py-1 flex justify-between items-center bg-[hsl(var(--ide-sidebar))]">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded hover:bg-gray-800/70 transition-colors ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
        >
          <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
          <span className="text-xs font-semibold">Like{post.likes?.length > 0 && <span className="ml-1">({post.likes.length})</span>}</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded hover:bg-gray-800/70 transition-colors text-gray-400"
        >
          <MessageSquare size={16} />
          <span className="text-xs font-semibold">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded hover:bg-gray-800/70 transition-colors text-gray-400">
          <Send size={16} />
          <span className="text-xs font-semibold">Send</span>
        </button>
      </div>

      {/* Inline Comments Section */}
      {showComments && (
        <div className="bg-black/20 p-3 animate-in fade-in duration-200">
          {user && (
            <div className="flex items-start gap-2 mb-4">
              <img
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username}`}
                className="w-8 h-8 rounded-full mt-1 border border-gray-700"
                alt="Me"
              />
              <div className="flex-1">
                <form onSubmit={handleCommentSubmit} className="relative">
                  <input
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-2 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    autoFocus
                  />
                  {newComment.trim() && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-50"
                      disabled={isSubmittingComment}
                    >
                      <Send size={14} fill="currentColor" />
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-500" size={20} />
            </div>
          ) : (
            <div className="space-y-3 pl-1">
              {commentTree.map((c) => renderComment(c))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
