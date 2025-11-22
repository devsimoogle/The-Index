
import React from 'react';
import { BlogPost, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  language: Language;
}

export const PostList: React.FC<PostListProps> = ({ posts, onSelectPost, language }) => {
  const t = UI_TRANSLATIONS[language];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24">
      {posts.map((post, index) => (
        <article 
          key={post.id} 
          className={`group cursor-pointer flex flex-col ${index % 3 === 0 ? 'md:col-span-2 md:grid md:grid-cols-12 md:gap-8 items-start' : ''}`}
          onClick={() => onSelectPost(post)}
        >
          {index % 3 === 0 ? (
            <>
              {/* Featured Layout */}
              <div className="md:col-span-3 font-mono text-xs text-zinc-400 border-t border-black pt-2 mt-1">
                {formatDate(post.date)} <br/>
                {post.readTime}
              </div>
              <div className="md:col-span-9">
                {post.coverImage && (
                  <div className="mb-8 w-full h-64 md:h-96 bg-zinc-100 overflow-hidden">
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                )}
                <h2 className="text-4xl md:text-6xl font-serif text-ink leading-none mb-6 group-hover:underline decoration-1 underline-offset-4 transition-all">
                <a 
                  href={`?post=${post.id}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPost(post, e);
                  }}
                  className="hover:no-underline focus:outline-none"
                >
                  {post.title}
                </a>
              </h2>
                <p className="text-lg md:text-xl text-zinc-600 font-serif leading-relaxed mb-6 max-w-2xl">
                  {post.excerpt}
                </p>
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="inline-block border border-zinc-200 px-2 py-1 text-[10px] uppercase tracking-widest text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
               {/* Standard Layout */}
              {post.coverImage && (
                 <div className="mb-6 w-full h-48 bg-zinc-100 overflow-hidden">
                   <img src={post.coverImage} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                 </div>
              )}
              <div className={`border-t border-zinc-200 pt-4 mb-4 flex justify-between items-baseline ${post.coverImage ? 'border-none pt-0' : ''}`}>
                 <span className="font-mono text-xs text-zinc-400">{formatDate(post.date)}</span>
                 <span className="font-mono text-xs text-zinc-400 uppercase">{post.author}</span>
              </div>
              <h3 className="text-3xl font-serif text-ink leading-tight mb-4 group-hover:text-zinc-600 transition-colors">
                <a 
                  href={`?post=${post.id}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPost(post, e);
                  }}
                  className="hover:no-underline focus:outline-none"
                >
                  {post.title}
                </a>
              </h3>
              <p className="text-base text-zinc-500 font-sans leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto">
                <span className="text-xs font-bold border-b border-black pb-0.5 group-hover:pb-1 transition-all uppercase">
                  {t.readEntry}
                </span>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
};
