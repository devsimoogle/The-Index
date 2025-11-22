import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered,
    Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon, Minus, Sparkles
} from 'lucide-react';

interface TipTapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, placeholder }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your story...',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border-2 border-zinc-200 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="border-b-2 border-zinc-200 bg-zinc-50 p-3 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-zinc-300 pr-2 mr-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bold') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('italic') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('strike') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Strikethrough"
                    >
                        <Strikethrough size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('code') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Inline Code"
                    >
                        <Code size={18} />
                    </button>
                </div>

                {/* Headings */}
                <div className="flex gap-1 border-r border-zinc-300 pr-2 mr-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Heading 1"
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Heading 2"
                    >
                        <Heading2 size={18} />
                    </button>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r border-zinc-300 pr-2 mr-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('orderedList') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Numbered List"
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>

                {/* Block Elements */}
                <div className="flex gap-1 border-r border-zinc-300 pr-2 mr-2">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('blockquote') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Quote"
                    >
                        <Quote size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="p-2 rounded hover:bg-white transition-colors text-zinc-600"
                        title="Horizontal Line"
                    >
                        <Minus size={18} />
                    </button>
                </div>

                {/* Media */}
                <div className="flex gap-1 border-r border-zinc-300 pr-2 mr-2">
                    <button
                        type="button"
                        onClick={setLink}
                        className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('link') ? 'bg-white shadow-sm text-black' : 'text-zinc-600'
                            }`}
                        title="Add Link"
                    >
                        <LinkIcon size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded hover:bg-white transition-colors text-zinc-600"
                        title="Add Image"
                    >
                        <ImageIcon size={18} />
                    </button>
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 rounded hover:bg-white transition-colors text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 rounded hover:bg-white transition-colors text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo size={18} />
                    </button>
                </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="font-serif" />

            {/* Footer */}
            <div className="border-t-2 border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 font-mono flex items-center gap-2">
                <Sparkles size={14} className="text-zinc-400" />
                <span>Professional rich text editor - Use toolbar or keyboard shortcuts</span>
            </div>
        </div>
    );
};
