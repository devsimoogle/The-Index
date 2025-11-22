
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BlogPost, Language, Comment, ReactionType } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { ArrowLeft, Send, Clock, Tag, Hash, Heart, Lightbulb, Bookmark, Volume2, Loader2, Square } from 'lucide-react';
import { generateBlogSpeech } from '../services/geminiService';

interface PostDetailProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  onBack: () => void;
  language: Language;
  comments: Comment[];
  onAddComment: (postId: string, author: string, content: string) => void;
  onSelectPost: (post: BlogPost) => void;
  reactions: Record<ReactionType, number>;
  onReact: (type: ReactionType) => void;
}

// Helper function to decode raw PCM data from Gemini TTS
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  // Ensure data byte length is even for Int16Array
  let processingData = data;
  if (processingData.byteLength % 2 !== 0) {
    console.warn("Audio data length not multiple of 2, trimming 1 byte.");
    // Copy to new aligned buffer to avoid alignment issues
    const alignedBuffer = new Uint8Array(processingData.length - 1);
    alignedBuffer.set(processingData.subarray(0, processingData.length - 1));
    processingData = alignedBuffer;
  }

  const dataInt16 = new Int16Array(processingData.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 to Float32
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const PostDetail: React.FC<PostDetailProps> = ({ 
  post, 
  relatedPosts,
  onBack, 
  language, 
  comments, 
  onAddComment,
  onSelectPost,
  reactions,
  onReact
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const isStoppedRef = useRef(false);

  // Parse content into blocks to enable paragraph-level highlighting
  const contentBlocks = useMemo(() => {
    if (!post || !post.content) return [];
    
    try {
      const div = document.createElement('div');
      div.innerHTML = post.content;
      
      // Get all paragraphs and headers, filtering out empty ones
      const children = Array.from(div.children);
      
      // If no children found (e.g. raw text), fallback
      if (children.length === 0) return [post.content || ""];

      const blocks: string[] = children
        .map(node => node.outerHTML)
        .filter(html => html.replace(/<[^>]*>/g, '').trim().length > 0);
        
      // If parsing results in empty (e.g. raw text), fallback to single block
      if (blocks.length === 0) return [post.content || ""];
      
      return blocks;
    } catch (e) {
      console.warn("Failed to parse content blocks", e);
      return [post.content || ""];
    }
  }, [post]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorName.trim() && commentText.trim()) {
      onAddComment(post.id, authorName, commentText);
      setAuthorName('');
      setCommentText('');
    }
  };

  const addEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  const formatDate = (dateString: string) => {
    try {
       const date = new Date(dateString);
       if (isNaN(date.getTime())) return dateString; // Fallback if invalid date
       return date.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch(e) {
       return dateString;
    }
  };

  const stopAudio = () => {
    isStoppedRef.current = true;
    try {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
    } catch (e) {
      // Ignore errors if already stopped
    }
    setIsPlaying(false);
    setPlayingIndex(null);
  };

  const playBlock = async (htmlContent: string, index: number) => {
    if (isStoppedRef.current) return;

    setPlayingIndex(index);
    setIsAudioLoading(true);

    try {
      // Strip tags for TTS
      const textToRead = htmlContent.replace(/<[^>]*>/g, ' ').trim();
      if (!textToRead) {
        setIsAudioLoading(false);
        return;
      }

      const audioData = await generateBlogSpeech(textToRead);
      
      if (isStoppedRef.current) return; // Check if stopped while generating

      if (!audioData) {
        throw new Error("Failed to generate audio");
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const audioBuffer = await decodeAudioData(audioData, audioContextRef.current, 24000);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      sourceNodeRef.current = source;

      return new Promise<void>((resolve) => {
        source.onended = () => {
          resolve();
        };
        source.start();
        setIsAudioLoading(false);
      });

    } catch (e) {
      console.error("Audio playback error", e);
      setIsAudioLoading(false);
    }
  };

  const handleToggleAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsPlaying(true);
    isStoppedRef.current = false;

    // Play title first
    await playBlock(`<h1>${post.title}</h1>`, -1);
    if (isStoppedRef.current) return;

    // Play Content Blocks sequentially
    for (let i = 0; i < contentBlocks.length; i++) {
      if (isStoppedRef.current) break;
      await playBlock(contentBlocks[i], i);
    }

    if (!isStoppedRef.current) {
      setIsPlaying(false);
      setPlayingIndex(null);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      // Safely close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(e => console.warn("Failed to close audio context", e));
        } catch (e) {
          console.warn("Error closing audio context", e);
        }
        audioContextRef.current = null;
      }
    };
  }, [post.id]);

  const slug = (post.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (!post) return null;

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-8 font-mono text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {t.backToIndex}
      </button>

      {post.coverImage && (
        <div className="mb-12 rounded-sm overflow-hidden shadow-sm aspect-video md:aspect-[21/9] relative bg-zinc-100">
          <img 
            src={post.coverImage} 
            alt={`Cover for ${post.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-16 border-b border-zinc-100 pb-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {Array.isArray(post.tags) && post.tags.map(tag => (
            <span key={tag} className="bg-zinc-50 border border-zinc-100 px-3 py-1 text-xs font-mono uppercase tracking-wider text-zinc-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-8 font-mono text-[10px] text-zinc-400 flex flex-wrap gap-x-8 gap-y-2 border-y border-zinc-50 py-4 uppercase tracking-widest">
          <span className="flex items-center gap-2"><Hash size={10} /> ID: {post.id}</span>
          <span className="flex items-center gap-2"><Tag size={10} /> Slug: {slug}</span>
          <span className="flex items-center gap-2"><Clock size={10} /> Published: {post.date}</span>
        </div>
        
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-serif text-ink leading-tight mb-10 transition-colors duration-300 ${playingIndex === -1 ? 'text-blue-600 bg-blue-50/50' : ''}`}>
          {post.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 font-mono text-sm text-zinc-500">
          <div className="flex gap-12">
            <div>
              <span className="block text-zinc-300 text-[10px] uppercase tracking-widest mb-1">{t.author}</span>
              <span className="text-ink border-b border-zinc-200 pb-0.5">{post.author}</span>
            </div>
            <div>
               <span className="block text-zinc-300 text-[10px] uppercase tracking-widest mb-1">{t.time}</span>
               {post.readTime}
            </div>
          </div>

          {/* Listen Button */}
          <button 
            onClick={handleToggleAudio}
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                isPlaying 
                ? 'bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100' 
                : 'bg-zinc-900 text-white hover:bg-zinc-700'
            }`}
          >
             {isAudioLoading ? (
                <Loader2 size={16} className="animate-spin" />
             ) : isPlaying ? (
                <Square size={16} fill="currentColor" />
             ) : (
                <Volume2 size={16} />
             )}
             <span className="font-mono text-xs uppercase tracking-widest">
                {isAudioLoading ? 'Buffering...' : isPlaying ? 'Stop Audio' : 'Listen to Entry'}
             </span>
          </button>
        </div>
      </header>

      <div className="prose prose-lg md:prose-xl prose-zinc max-w-3xl mx-auto font-serif leading-loose">
        {/* Render content blocks individually for highlighting */}
        {contentBlocks.map((block, index) => (
          <div 
            key={index}
            dangerouslySetInnerHTML={{ __html: block }}
            className={`transition-all duration-500 rounded px-2 -mx-2 ${playingIndex === index ? 'bg-blue-50 text-blue-900 shadow-sm scale-[1.01]' : ''}`}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-24 pt-12 border-t border-zinc-100 text-center">
        <p className="font-serif italic text-zinc-500 text-lg mb-8">
          {t.endOfEntry}
        </p>
        
        {/* Reaction Bar */}
        <div className="flex justify-center gap-8">
           <button 
             onClick={() => onReact('heart')}
             className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
           >
             <div className="p-3 rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
               <Heart size={24} fill={reactions.heart > 0 ? "currentColor" : "none"} />
             </div>
             <span className="font-mono text-xs text-zinc-400">{reactions.heart || 0}</span>
           </button>
           
           <button 
             onClick={() => onReact('insightful')}
             className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
           >
             <div className="p-3 rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
               <Lightbulb size={24} fill={reactions.insightful > 0 ? "currentColor" : "none"} />
             </div>
             <span className="font-mono text-xs text-zinc-400">{reactions.insightful || 0}</span>
           </button>

           <button 
             onClick={() => onReact('bookmark')}
             className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
           >
             <div className="p-3 rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
               <Bookmark size={24} fill={reactions.bookmark > 0 ? "currentColor" : "none"} />
             </div>
             <span className="font-mono text-xs text-zinc-400">{reactions.bookmark || 0}</span>
           </button>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-24 border-t border-zinc-100 pt-12">
          <h3 className="font-serif text-2xl mb-8 text-ink">{t.relatedEntries}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(rp => (
              <div key={rp.id} onClick={() => onSelectPost(rp)} className="cursor-pointer group">
                 {rp.coverImage && (
                   <div className="mb-4 aspect-video overflow-hidden bg-zinc-100">
                     <img src={rp.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   </div>
                 )}
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2 block">{formatDate(rp.date)}</span>
                <h4 className="font-serif text-xl leading-tight text-ink group-hover:underline decoration-1 underline-offset-4 transition-all">{rp.title}</h4>
                <div className="flex flex-wrap gap-1 mt-3">
                   {Array.isArray(rp.tags) && rp.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] uppercase tracking-wider text-zinc-400 border border-zinc-100 px-1.5 py-0.5">{tag}</span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="max-w-2xl mx-auto mt-24 mb-24">
        <h3 className="font-serif text-2xl mb-8 text-ink">{t.comments} <span className="text-zinc-400 text-lg ml-2">({comments.length})</span></h3>
        
        {/* List */}
        <div className="space-y-8 mb-12">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-zinc-50/50 p-6 border-l-2 border-zinc-100">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">{comment.author}</span>
                  <span className="font-mono text-[10px] text-zinc-400">{comment.date.toLocaleDateString(language)}</span>
                </div>
                <p className="font-serif text-zinc-700 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-zinc-400 italic font-serif text-center py-8 border border-dashed border-zinc-200 rounded">
              {t.noComments}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white mt-8">
          <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-6">{t.postComment}</h4>
          <form onSubmit={handleSubmitComment} className="space-y-6">
            <div>
              <input 
                type="text" 
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t.namePlaceholder}
                aria-label="Your Name"
                className="w-full border-b border-zinc-200 py-2 text-sm font-sans focus:outline-none focus:border-zinc-800 transition-colors placeholder-zinc-300"
                required
              />
            </div>
            <div className="relative">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t.messagePlaceholder}
                aria-label="Your Comment"
                rows={4}
                className="w-full border-b border-zinc-200 py-2 text-sm font-sans focus:outline-none focus:border-zinc-800 transition-colors placeholder-zinc-300 resize-none"
                required
              />
              
              {/* Emoji Picker Bar */}
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                 {['👍', '❤️', '💡', '🤔', '🎉', '📚', '🧐', '✨'].map(emoji => (
                   <button
                     key={emoji}
                     type="button"
                     onClick={() => addEmoji(emoji)}
                     className="hover:bg-zinc-100 p-1.5 rounded text-lg transition-colors"
                     aria-label={`Add ${emoji} emoji`}
                   >
                     {emoji}
                   </button>
                 ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-ink text-white px-6 py-2 text-xs font-mono uppercase tracking-widest hover:bg-zinc-700 transition-colors flex items-center gap-2"
              >
                {t.submit} <Send size={12} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
};
