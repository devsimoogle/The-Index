import React from 'react';
import { Bold, Italic, List, Heading2, Quote, Code, Link } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const insertFormatting = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const formatButtons = [
        { icon: Bold, label: 'Bold', before: '<strong>', after: '</strong>' },
        { icon: Italic, label: 'Italic', before: '<em>', after: '</em>' },
        { icon: Heading2, label: 'Heading', before: '<h2>', after: '</h2>' },
        { icon: Quote, label: 'Quote', before: '<blockquote>', after: '</blockquote>' },
        { icon: List, label: 'List', before: '<ul>\n<li>', after: '</li>\n</ul>' },
        { icon: Code, label: 'Code', before: '<code>', after: '</code>' },
        { icon: Link, label: 'Link', before: '<a href="URL">', after: '</a>' },
    ];

    return (
        <div className="border border-zinc-200 rounded overflow-hidden">
            {/* Toolbar */}
            <div className="bg-zinc-50 border-b border-zinc-200 p-2 flex flex-wrap gap-1">
                {formatButtons.map((button) => (
                    <button
                        key={button.label}
                        type="button"
                        onClick={() => insertFormatting(button.before, button.after)}
                        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all flex items-center gap-1 text-zinc-600 hover:text-black"
                        title={button.label}
                    >
                        <button.icon size={16} />
                        <span className="text-xs hidden sm:inline">{button.label}</span>
                    </button>
                ))}
            </div>

            {/* Editor */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || 'Write your content here...'}
                className="w-full p-4 font-serif text-base leading-relaxed focus:outline-none resize-none min-h-[400px]"
                style={{ fontFamily: 'Georgia, serif' }}
            />

            {/* Helper Text */}
            <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 font-mono">
                💡 Tip: Select text and click formatting buttons, or write HTML directly
            </div>
        </div>
    );
};
