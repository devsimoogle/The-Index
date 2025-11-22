
import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, X } from 'lucide-react';
import { askLibrarian } from '../services/geminiService';
import { ChatMessage } from '../types';

export const LibrarianBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'Greetings. I am the Reference Librarian. How may I assist you with your research today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const { text, sources } = await askLibrarian(input);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: text,
      sources: sources,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button - High Z-index for mobile visibility */}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] group flex items-center gap-3 px-5 py-4 bg-black text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-black/20 rounded-full ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <BookOpen size={20} />
        <span className="hidden md:inline font-serif italic tracking-wide pr-2">Ask the Librarian</span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-[110] w-[90vw] md:w-[400px] bg-white/95 backdrop-blur-xl border border-zinc-200/50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none translate-y-10'} flex flex-col h-[600px] max-h-[80vh]`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-zinc-100 bg-zinc-50/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div>
              <h3 className="font-serif text-lg text-ink font-medium leading-none">Reference Desk</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">AI Assistant</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-black text-white font-sans rounded-2xl rounded-tr-sm'
                    : 'bg-zinc-50 text-zinc-800 border border-zinc-100 font-serif rounded-2xl rounded-tl-sm'
                  }`}
              >
                {msg.text}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-zinc-200/50">
                    <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-2 font-sans flex items-center gap-1">
                      <BookOpen size={10} /> Sources
                    </p>
                    <ul className="space-y-1.5">
                      {msg.sources.map((source, i) => (
                        <li key={i}>
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-sans text-zinc-500 hover:text-blue-600 transition-colors truncate group"
                          >
                            <span className="min-w-[4px] w-1 h-1 rounded-full bg-zinc-300 group-hover:bg-blue-400 transition-colors"></span>
                            <span className="truncate underline decoration-zinc-200 underline-offset-2 group-hover:decoration-blue-200">{source.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-zinc-300 mt-1.5 uppercase tracking-wider font-mono px-1">
                {msg.role === 'user' ? 'You' : 'Librarian'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-zinc-50 border border-zinc-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-100 bg-white/80 backdrop-blur-md">
          <div className="relative flex items-center shadow-sm rounded-full bg-zinc-50 border border-zinc-200 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-100 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about library science..."
              className="w-full bg-transparent p-3.5 pl-5 pr-12 text-sm font-sans text-ink focus:outline-none placeholder-zinc-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-black text-white rounded-full hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-black transition-all hover:scale-105 active:scale-95"
            >
              <Send size={14} />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[9px] text-zinc-300 font-mono uppercase tracking-widest">Powered by Gemini AI</p>
          </div>
        </div>
      </div>
    </>
  );
};