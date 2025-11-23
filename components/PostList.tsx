
import React from 'react';
import { BlogPost, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost, e?: React.MouseEvent) => void;
  language: Language;
}

export const PostList: React.FC<PostListProps> = ({ posts, onSelectPost, language }) => {
  const t = UI_TRANSLATIONS[language];
  const { currentTheme } = useTheme();
  const layout = currentTheme.layout || 'classic';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // --- Layout: Minimal ---
  if (layout === 'minimal') {
    return (
      <div className="max-w-3xl mx-auto space-y-12">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group cursor-pointer border-b border-zinc-800 pb-8"
            onClick={() => onSelectPost(post)}
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h2 className="text-2xl md:text-3xl font-mono text-ink group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <span className="font-mono text-xs text-zinc-500 shrink-0 mt-2 md:mt-0">{formatDate(post.date)}</span>
            </div>
            <p className="font-mono text-sm text-zinc-400 max-w-xl mb-4">{post.excerpt}</p>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono text-accent border border-zinc-800 px-1">#{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    );
  }

  // --- Layout: Grid ---
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group cursor-pointer bg-mist/30 border border-zinc-100/50 hover:border-accent/50 transition-all duration-300 flex flex-col h-full"
            onClick={() => onSelectPost(post)}
          >
            {post.coverImage && (
              <div className="w-full h-48 overflow-hidden">
                <img src={post.coverImage} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{post.readTime}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">{post.tags[0]}</span>
              </div>
              <h3 className="text-xl font-serif text-ink mb-3 leading-tight group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-500 font-sans leading-relaxed mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              <div className="pt-4 border-t border-zinc-100/50 flex justify-between items-center mt-auto">
                <span className="text-xs font-mono text-zinc-400">{formatDate(post.date)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  // --- Layout: Magazine (Hero + Grid) ---
  if (layout === 'magazine') {
    return (
      <div className="space-y-16">
        {/* Hero Post */}
        {posts.length > 0 && (
          <article
            className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            onClick={() => onSelectPost(posts[0])}
          >
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-accent"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-accent">Featured Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink leading-tight mb-6 group-hover:text-zinc-600 transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-lg text-zinc-600 font-serif leading-relaxed mb-6">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 uppercase tracking-widest">
                <span>{formatDate(posts[0].date)}</span>
                <span>•</span>
                <span>{posts[0].readTime}</span>
              </div>
            </div>
            <div className="order-1 md:order-2 w-full h-64 md:h-[500px] bg-zinc-100 overflow-hidden relative">
              {posts[0].coverImage && (
                <img src={posts[0].coverImage} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5"></div>
            </div>
          </article>
        )}

        {/* Remaining Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 border-t border-zinc-100 pt-16">
          {posts.slice(1).map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer"
              onClick={() => onSelectPost(post)}
            >
              {post.coverImage && (
                <div className="mb-4 w-full h-48 bg-zinc-100 overflow-hidden">
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
              <h3 className="text-2xl font-serif text-ink leading-tight mb-3 group-hover:underline decoration-1 underline-offset-4">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-500 font-sans leading-relaxed mb-3 line-clamp-3">
                {post.excerpt}
              </p>
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">{formatDate(post.date)}</span>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // --- Layout: Classic (Default) ---
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
                {formatDate(post.date)} <br />
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
