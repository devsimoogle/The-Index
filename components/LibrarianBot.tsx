
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
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex items-center gap-3 px-4 py-3 md:px-5 md:py-3 bg-ink text-white shadow-2xl transition-all duration-300 hover:bg-zinc-800 rounded-full md:rounded-none ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <BookOpen size={18} />
        <span className="hidden md:inline font-serif italic tracking-wide">Ask the Librarian</span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-0 md:bottom-8 md:right-8 z-[110] w-full md:w-96 bg-white border border-zinc-200 shadow-2xl transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} flex flex-col h-[80vh] md:h-[600px] max-h-[100vh]`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-serif text-lg text-ink">Reference Desk</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 bg-white"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 md:p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 text-white font-sans' 
                    : 'bg-zinc-50 text-zinc-800 border border-zinc-100 font-serif'
                }`}
              >
                {msg.text}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-zinc-200">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-sans">Sources</p>
                    <ul className="space-y-1">
                      {msg.sources.map((source, i) => (
                        <li key={i}>
                          <a 
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-sans text-zinc-500 hover:text-ink transition-colors truncate"
                          >
                            <span className="min-w-[4px] w-1 h-1 rounded-full bg-zinc-300"></span>
                            <span className="truncate">{source.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-300 mt-1 uppercase tracking-wider font-mono">
                {msg.role === 'user' ? 'Patron' : 'Librarian'} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start">
              <div className="bg-zinc-50 border border-zinc-100 p-4">
                 <div className="flex gap-1">
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-100 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Inquire about classification, archiving..."
              className="w-full bg-zinc-50 border border-zinc-200 p-3 pr-10 text-sm font-sans text-ink focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors placeholder-zinc-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 text-zinc-400 hover:text-ink disabled:opacity-30 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};