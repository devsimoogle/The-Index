
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { LibrarianBot } from './components/LibrarianBot';
import { AdminPanel } from './components/AdminPanel';
import { UI_TRANSLATIONS } from './constants';
import { BlogPost, ViewState, Language, Comment, SortOrder, PostReactions, ReactionType } from './types';
import { storageService } from './services/storage';

const App: React.FC = () => {
  // Initialize Persistence Layer
  useEffect(() => {
    storageService.init();
  }, []);

  // Persistence Logic: Initialize state from localStorage if available
  const getInitialState = () => {
    try {
      // Safe check for localStorage availability
      const hasStorage = typeof window !== 'undefined' && (() => {
        try { return !!window.localStorage; } catch { return false; }
      })();

      if (!hasStorage) {
        return { viewState: ViewState.HOME, selectedPostId: null };
      }

      const saved = localStorage.getItem('lis_journal_state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Safety check: JSON.parse('null') returns null, checking for object type ensures we have a valid state object
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        } catch (parseErr) {
          // If parsing fails, clear corrupted state
          console.warn("Resetting corrupted state", parseErr);
          try { localStorage.removeItem('lis_journal_state'); } catch { }
        }
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    return { viewState: ViewState.HOME, selectedPostId: null };
  };

  const initialState = getInitialState();

  // Provide fallback defaults if initialState properties are missing
  const [viewState, setViewState] = useState<ViewState>(initialState?.viewState || ViewState.HOME);
  // Store ID instead of object so it survives language switches correctly
  const [selectedPostId, setSelectedPostId] = useState<string | null>(initialState?.selectedPostId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Initialize posts from storage service
  const [allPosts, setAllPosts] = useState<Record<Language, BlogPost[]>>({
    en: [],
    ig: [],
    yo: [],
    ha: []
  });

  // Load posts from API on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await storageService.getPosts();
        setAllPosts(posts);
      } catch (e) {
        console.error("Failed to load posts", e);
      }
    };
    loadPosts();
  }, []);

  // State for comments: Record<PostId, Comment[]>
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  // Load comments from API on mount
  useEffect(() => {
    const loadComments = async () => {
      try {
        const savedComments = await storageService.getComments();
        setComments(savedComments);
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    };
    loadComments();
  }, []);

  // State for reactions
  const [reactions, setReactions] = useState<PostReactions>({});

  // Save state changes to localStorage
  useEffect(() => {
    try {
      const hasStorage = typeof window !== 'undefined' && (() => {
        try { return !!window.localStorage; } catch { return false; }
      })();

      if (hasStorage) {
        localStorage.setItem('lis_journal_state', JSON.stringify({ viewState, selectedPostId }));
      }
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [viewState, selectedPostId]);

  // Sync URL with specific post
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId && postId !== selectedPostId) {
      setSelectedPostId(postId);
      setViewState(ViewState.POST);
    }
  }, []); // Run once on mount

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedPostId) {
      params.set('post', selectedPostId);
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    } else if (viewState === ViewState.HOME) {
      params.delete('post');
      // Only push state if we need to clear the param
      if (window.location.search.includes('post')) {
        window.history.pushState({}, '', window.location.pathname);
      }
    }
  }, [selectedPostId, viewState]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];

  // Get all posts regardless of language to ensure content is always visible
  const currentLanguagePosts = useMemo(() => {
    if (!allPosts || typeof allPosts !== 'object') return [];
    // Flatten all posts from all languages into a single array
    return Object.values(allPosts).flat();
  }, [allPosts]);

  // Helper to check if a post is visible (published)
  const isVisible = (post: BlogPost) => post && post.status !== 'draft';

  // Derive selected post from ID and current language
  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    // Defensive check for currentLanguagePosts being an array
    if (!Array.isArray(currentLanguagePosts)) return null;
    return currentLanguagePosts.find(p => p && p.id === selectedPostId) || null;
  }, [selectedPostId, currentLanguagePosts]);

  // Calculate related posts based on tags, excluding drafts
  const relatedPosts = useMemo(() => {
    // Defensive checks to prevent crashes if data is malformed
    if (!selectedPost || !Array.isArray(selectedPost.tags)) return [];
    if (!Array.isArray(currentLanguagePosts)) return [];

    return currentLanguagePosts.filter(post =>
      post &&
      post.id !== selectedPost.id &&
      isVisible(post) &&
      Array.isArray(post.tags) &&
      post.tags.some(tag => selectedPost.tags.includes(tag))
    ).slice(0, 3);
  }, [selectedPost, currentLanguagePosts]);

  const handleSelectPost = (post: BlogPost, e?: React.MouseEvent) => {
    // Prevent default behavior if event is provided (prevents anchor tag navigation)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!post || !post.id) return;

    // Update URL with post ID
    const params = new URLSearchParams(window.location.search);
    params.set('post', post.id);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ postId: post.id }, '', newUrl);

    // Update state
    setSelectedPostId(post.id);
    setViewState(ViewState.POST);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedPostId(null);
    setViewState(ViewState.HOME);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && viewState !== ViewState.HOME) {
      setViewState(ViewState.HOME);
      setSelectedPostId(null);
    }
  };

  const handleAddComment = async (postId: string, author: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      content,
      date: new Date()
    };

    try {
      await storageService.saveComment(newComment);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  const handleReaction = (postId: string, type: ReactionType) => {
    setReactions(prev => {
      const postReactions = prev[postId] || { heart: 0, insightful: 0, bookmark: 0 };
      return {
        ...prev,
        [postId]: {
          ...postReactions,
          [type]: postReactions[type] + 1
        }
      };
    });
  };

  const handleAddPost = async (newPost: BlogPost) => {
    try {
      await storageService.savePost(newPost);
      // Reload from storage to ensure sync
      const posts = await storageService.getPosts();
      setAllPosts(posts);

      // If published, switch to home. If draft, stay or maybe notify.
      if (newPost.status !== 'draft') {
        setViewState(ViewState.HOME);
      }
    } catch (e) {
      console.error("Failed to add post", e);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await storageService.deletePost(postId);
      // Reload from storage
      const posts = await storageService.getPosts();
      setAllPosts(posts);

      // If deleted post was selected, go back home
      if (selectedPostId === postId) {
        handleBack();
      }
    } catch (e) {
      console.error("Failed to delete post", e);
    }
  };

  // Filter then Sort
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(currentLanguagePosts)) return [];

    return currentLanguagePosts.filter(post => {
      if (!post) return false;
      // Hide drafts from main feed
      if (!isVisible(post)) return false;

      const query = searchQuery.toLowerCase();
      return (
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (Array.isArray(post.tags) && post.tags.some(tag => tag && tag.toLowerCase().includes(query)))
      );
    });
  }, [currentLanguagePosts, searchQuery]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      // Handle NaN cases gracefully
      const valA = isNaN(dateA) ? 0 : dateA;
      const valB = isNaN(dateB) ? 0 : dateB;

      return sortOrder === 'newest' ? valB - valA : valA - valB;
    });
  }, [filteredPosts, sortOrder]);

  const allPostsChronological = useMemo(() => {
    if (!Array.isArray(currentLanguagePosts)) return [];

    // Also hide drafts from Archive
    return [...currentLanguagePosts]
      .filter(isVisible)
      .sort((a, b) => {
        const valA = a.date ? new Date(a.date).getTime() : 0;
        const valB = b.date ? new Date(b.date).getTime() : 0;
        return (isNaN(valB) ? 0 : valB) - (isNaN(valA) ? 0 : valA);
      });
  }, [currentLanguagePosts]);

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-black selection:text-white">
      <Header
        setViewState={setViewState}
        viewState={viewState}
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-12 md:py-24 min-h-[80vh]">
        {viewState === ViewState.HOME && (
          <>
            {!searchQuery && (
              <div className="mb-24 md:mb-32 max-w-4xl">
                <p className="font-serif text-2xl md:text-4xl leading-relaxed text-zinc-800">
                  <span className="font-bold">The Index</span> is a digital quarterly dedicated to the changing landscape of library science, archiving, and the philosophy of information.
                </p>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-zinc-100 pb-4 gap-4">
              {searchQuery ? (
                <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
                  Search Results for <span className="text-ink">"{searchQuery}"</span> — {sortedPosts.length} found
                </p>
              ) : (
                <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
                  {t.currentIssue}
                </p>
              )}

              {/* Sort Controls */}
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 flex gap-2">
                <span>{t.sortBy}:</span>
                <button
                  onClick={() => setSortOrder('newest')}
                  className={`hover:text-ink transition-colors ${sortOrder === 'newest' ? 'text-ink font-bold underline underline-offset-4' : ''}`}
                >
                  {t.newest}
                </button>
                <span>/</span>
                <button
                  onClick={() => setSortOrder('oldest')}
                  className={`hover:text-ink transition-colors ${sortOrder === 'oldest' ? 'text-ink font-bold underline underline-offset-4' : ''}`}
                >
                  {t.oldest}
                </button>
              </div>
            </div>

            {sortedPosts.length > 0 ? (
              <PostList
                posts={sortedPosts}
                onSelectPost={handleSelectPost}
                language={language}
              />
            ) : (
              <div className="py-12 text-center">
                <p className="font-serif text-xl text-zinc-400 italic">No entries found matching your query.</p>
              </div>
            )}
          </>
        )}

        {viewState === ViewState.POST && selectedPost && (
          <PostDetail
            post={selectedPost}
            relatedPosts={relatedPosts}
            onBack={handleBack}
            language={language}
            comments={comments && comments[selectedPost.id] ? comments[selectedPost.id] : []}
            onAddComment={handleAddComment}
            onSelectPost={handleSelectPost}
            reactions={reactions[selectedPost.id] || { heart: 0, insightful: 0, bookmark: 0 }}
            onReact={(type) => handleReaction(selectedPost.id, type)}
          />
        )}

        {viewState === ViewState.ARCHIVE && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-serif text-5xl mb-12 text-ink">{t.archives}</h2>

            <div className="space-y-6">
              {allPostsChronological.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col md:flex-row gap-4 md:items-baseline border-b border-zinc-100 pb-6 cursor-pointer hover:bg-zinc-50/50 transition-colors -mx-4 px-4 pt-4 rounded"
                  onClick={() => handleSelectPost(post)}
                >
                  <div className="w-32 shrink-0 font-mono text-xs text-zinc-400 uppercase tracking-widest">
                    {post.date ? new Date(post.date).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-ink group-hover:underline decoration-1 underline-offset-4 transition-all">{post.title}</h3>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    {Array.isArray(post.tags) && post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider text-zinc-400 border border-zinc-100 px-1.5 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setViewState(ViewState.HOME)}
              className="mt-16 border-b border-black text-sm font-bold tracking-widest uppercase font-mono"
            >
              {t.backToIndex}
            </button>
          </div>
        )}

        {viewState === ViewState.MASTHEAD && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <h2 className="font-serif text-5xl mb-12 text-center text-ink">{t.masthead}</h2>

            <div className="bg-zinc-50 p-8 md:p-12 border border-zinc-100 mb-12 text-center">
              <h3 className="font-serif text-2xl italic mb-6">The Index.</h3>
              <p className="font-serif text-lg text-zinc-600 leading-relaxed mb-8">
                {t.aboutText}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-200 pt-8 text-left">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{t.course}</span>
                  <span className="font-serif text-xl">LIS403</span>
                  <span className="block text-sm text-zinc-500 mt-1">Library Information Systems</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{t.creator}</span>
                  <span className="font-serif text-xl">Olajuwon</span>
                  <span className="block text-sm text-zinc-500 mt-1">Student / Developer</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                © 2025 The Index. All rights reserved. <br />
                Designed with a focus on minimalism, typography, and accessibility.
              </p>
            </div>
          </div>
        )}

        {viewState === ViewState.ADMIN && (
          <AdminPanel
            posts={Object.values(allPosts).flat()}
            onAddPost={handleAddPost}
            onDeletePost={handleDeletePost}
          />
        )}
      </main>

      <footer className="border-t border-zinc-100 py-12 px-6 md:px-12 bg-zinc-50">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h4 className="font-serif font-bold text-lg mb-2">The Index.</h4>
            <p className="font-sans text-xs text-zinc-400 max-w-xs leading-relaxed">
              Curating the world's knowledge, one bit at a time.
              Classwork Project for LIS403.
            </p>
            <p className="font-mono text-[10px] text-zinc-400 mt-6 uppercase tracking-widest">
              Created by Olajuwon
            </p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Social</span>
              <a href="#" className="text-sm hover:text-zinc-600">Twitter</a>
              <a href="#" className="text-sm hover:text-zinc-600">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Legal</span>
              <button onClick={() => setViewState(ViewState.ADMIN)} className="text-sm hover:text-zinc-600 text-left">Admin Login</button>
              <a href="#" className="text-sm hover:text-zinc-600">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      <LibrarianBot />
    </div>
  );
};

export default App;
