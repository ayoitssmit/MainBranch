"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Code } from 'lucide-react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
    const [view, setView] = React.useState<'edit' | 'preview' | 'split'>('split');

    return (
        <div className="flex flex-col h-full border border-[hsl(var(--ide-border))] rounded-md overflow-hidden bg-[hsl(var(--ide-bg))]">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b border-[hsl(var(--ide-border))] bg-[hsl(var(--ide-sidebar))]">
                <button 
                    onClick={() => setView('edit')}
                    className={`p-1.5 rounded hover:bg-white/10 ${view === 'edit' ? 'text-blue-400 bg-white/5' : 'text-gray-400'}`}
                    title="Edit"
                >
                    <Code size={16} />
                </button>
                <button 
                    onClick={() => setView('preview')}
                    className={`p-1.5 rounded hover:bg-white/10 ${view === 'preview' ? 'text-blue-400 bg-white/5' : 'text-gray-400'}`}
                    title="Preview"
                >
                    <Eye size={16} />
                </button>
                <button 
                    onClick={() => setView('split')}
                    className={`hidden md:flex items-center gap-1 text-xs px-2 py-1.5 rounded hover:bg-white/10 ${view === 'split' ? 'text-blue-400 bg-white/5' : 'text-gray-400'}`}
                >
                    <span className="w-[1px] h-3 bg-current opacity-50 mx-0.5" />
                    Split
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Editor Pane */}
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`flex-1 p-4 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none overflow-auto ${view === 'preview' ? 'hidden' : 'block'}`}
                    placeholder="# Hello World\n\nStart writing your amazing article here..."
                />

                {/* Vertical Divider for Split View */}
                {view === 'split' && (
                    <div className="w-[1px] bg-[hsl(var(--ide-border))]" />
                )}

                {/* Preview Pane */}
                <div className={`flex-1 p-8 overflow-auto bg-[hsl(var(--ide-bg))] prose prose-invert max-w-none ${view === 'edit' ? 'hidden' : 'block'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
