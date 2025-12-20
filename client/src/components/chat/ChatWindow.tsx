import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import { Send, ArrowLeft, MoreVertical, Paperclip, Smile, Check, CheckCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
    recipient: any;
    onBack: () => void;
}

interface Message {
    _id: string;
    sender: string; // ID
    content: string;
    createdAt: string;
    read?: boolean;
}

export default function ChatWindow({ recipient, onBack }: ChatWindowProps) {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const markMessagesAsRead = async () => {
        if (!user || !recipient) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/chat/${recipient._id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistically update local state? Or wait for socket? 
            // In a real app we might do both, but here we can just wait or do nothing if we rely on socket for *other* side.
            // But wait, WE are reading, so we don't see ticks for ourselves change. We see ticks change when THEY read OUR messages.
        } catch (error) {
            console.error("Mark read failed", error);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!user || !recipient) return;
            try {
                const token = localStorage.getItem('token');
                // 1. Mark as read immediately when opening
                await axios.put(`http://localhost:5000/api/chat/${recipient._id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 2. Fetch messages
                const { data } = await axios.get(`http://localhost:5000/api/chat/${recipient._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(data);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
    }, [recipient, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]); // Scroll when typing starts too

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data: any) => {
            if (data.sender._id === recipient._id) {
                setMessages((prev) => [...prev, data.message]);
                setIsTyping(false); // Stop typing if message received
                markMessagesAsRead(); // Mark incoming as read if window is open
            }
        };

        const handleTyping = (data: any) => {
             if (data.senderId === recipient._id) {
                 setIsTyping(true);
             }
        };

        const handleStopTyping = (data: any) => {
            if (data.senderId === recipient._id) {
                setIsTyping(false);
            }
        };

        const handleMessagesRead = (data: any) => {
            // If the other person read OUR messages
            if (data.readerId === recipient._id) {
                setMessages(prev => prev.map(msg => 
                    msg.sender === user?._id ? { ...msg, read: true } : msg
                ));
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, recipient]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (!socket || !recipient) return;

        // Emit typing event
        socket.emit('typing', { recipientId: recipient._id });

        // Clear existing timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set new timeout to stop typing after delay
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { recipientId: recipient._id });
        }, 2000);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        
        // Stop typing immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket?.emit('stop_typing', { recipientId: recipient._id });

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/chat', 
                { recipientId: recipient._id, content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[hsl(var(--ide-bg))] relative overflow-hidden">
            
            {/* Background Grid Pattern for Tech Feel */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Header - Glassmorphic */}
            <div className="p-4 flex items-center justify-between sticky top-0 bg-[hsl(var(--ide-bg))]/80 backdrop-blur-md border-b border-[hsl(var(--ide-border))] z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="md:hidden text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    
                    <div className="relative">
                        <img 
                            src={recipient.avatarUrl || `https://ui-avatars.com/api/?name=${recipient.username}&background=0f172a&color=3b82f6`} 
                            className="w-10 h-10 rounded-lg object-cover bg-black border border-gray-700"
                            alt={recipient.username}
                        />
                         <div className="absolute -bottom-1 -right-1 bg-black p-0.5 rounded-full">
                            <span className="block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">{recipient.displayName || recipient.username}</h3>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-mono">● Secured Connect</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Messages Area - Bottom Aligned */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col justify-end min-h-0 relative z-10">
                {/* Scroll spacer to allow scrolling up */}
                <div className="flex-1" /> 
                
                {messages.length === 0 && (
                     <div className="text-center text-gray-600 my-auto">
                        <div className="w-16 h-16 mx-auto mb-4 border border-dashed border-gray-700 rounded-full flex items-center justify-center">
                             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                        </div>
                        <p className="font-mono text-sm">INITIALIZING UPLINK...</p>
                        <p className="text-xs mt-2 opacity-50">Send a packet to begin.</p>
                     </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender === user?._id;
                    return (
                        <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                            <div className={`max-w-[75%] relative ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                
                                {/* Tech Bubble */}
                                <div className={`relative px-5 py-3 text-sm border backdrop-blur-sm shadow-sm ${
                                    isMe 
                                    ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-50 rounded-2xl rounded-tr-sm' 
                                    : 'bg-gray-800/40 border-gray-700/50 text-gray-200 rounded-2xl rounded-tl-sm'
                                }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>

                                    {/* Metadata Row */}
                                    <div className={`flex items-center gap-2 mt-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className="text-[10px] text-gray-500 font-mono opacity-60 uppercase">
                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                        </span>
                                        
                                        {isMe && (
                                            <div className={`flex transition-colors ${msg.read ? 'text-cyan-400' : 'text-gray-500'} opacity-80`}>
                                                {/* Simulated Read Receipt */}
                                                <CheckCheck size={14} />
                                            </div>
                                        )}
                                    </div>

                            </div>
                        </div>
                    );
                })}
                
                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex w-full justify-start animate-in fade-in duration-300">
                         <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                         </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Command Line Style */}
            <div className="p-3 bg-[hsl(var(--ide-bg))]/90 backdrop-blur-md border-t border-[hsl(var(--ide-border))] z-20">
                <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-black/40 border border-gray-700/50 rounded-xl p-2 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
                    
                    {/* Attachments (Visual Only) */}
                    <button type="button" className="p-2 text-gray-500 hover:text-cyan-400 transition-colors">
                        <Paperclip size={18} />
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Enter command or message..."
                        className="flex-1 bg-transparent border-none px-2 py-2 text-sm text-gray-200 focus:outline-none font-mono placeholder:text-gray-600"
                    />

                    {/* Emoji (Visual Only) */}
                    <button type="button" className="p-2 text-gray-500 hover:text-yellow-400 transition-colors">
                        <Smile size={18} />
                    </button>

                    <button 
                        type="submit" 
                        disabled={sending || !newMessage.trim()}
                        className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-900/20"
                    >
                        {sending ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
