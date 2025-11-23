
import React, { useState, useRef, useEffect } from 'react';
import { BlogPost } from '../types';
import { storageService } from '../services/storage';
import { TipTapEditor } from './TipTapEditor';
import {
  Plus, Save, Database, Image as ImageIcon, X, Trash2, Eye, FileText,
  Bold, Italic, List, Heading2, Quote, Search, CheckCircle, CircleDashed, AlertTriangle, LogOut, Edit, EyeOff, Sparkles, Zap, BookOpen, Palette,
  Layout as LayoutIcon, Type, Maximize, Minimize, Square
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { LayoutTemplate, ThemeScale, BorderRadius } from '../types/theme';
import { PREMADE_TEMPLATES } from '../constants/templates';
import { Toast } from './Toast';

interface AdminPanelProps {
  posts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onDeletePost: (postId: string) => void;
}

type Tab = 'create' | 'manage' | 'appearance' | 'templates';
type PostStatus = 'published' | 'draft';

// Utility function to calculate read time
const calculateReadTime = (content: string): string => {
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ posts, onAddPost, onDeletePost }) => {
  const {
    currentTheme, setTheme, updateThemeColors, availableThemes,
    updateThemeLayout, updateThemeFonts, updateThemeScale, updateThemeRadius
  } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('create');

  // Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [author, setAuthor] = useState('Olajuwon O.');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<PostStatus>('published');
  const [showPreview, setShowPreview] = useState(false);

  // Manage Tab State
  const [manageSearch, setManageSearch] = useState('');
  const [manageFilter, setManageFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pendingPublishStatus, setPendingPublishStatus] = useState<PostStatus | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Available tags from existing posts
  const availableTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  const suggestedTags = availableTags.filter(tag =>
    !selectedTags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  // Auto-calculate read time when content changes
  useEffect(() => {
    if (content) {
      setReadTime(calculateReadTime(content));
    }
  }, [content]);

  // Check for existing session on mount
  useEffect(() => {
    if (storageService.checkAdminSession()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'lis_secure_2025') {
      setIsAuthenticated(true);
      storageService.setAdminSession();
    } else {
      alert('Access Denied: Incorrect credentials.');
    }
  };

  const handleLogout = () => {
    storageService.clearAdminSession();
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag management
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag(newTag);
    }
  };

  // Rich Text Editor Utilities
  const insertFormat = (startTag: string, endTag: string = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + startTag + selection + endTag + after;
    setContent(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgTag = `<img src="${reader.result}" alt="Embedded Image" class="w-full h-auto my-8 rounded-sm shadow-sm" />`;
        insertFormat(imgTag);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatContentForSave = (rawContent: string) => {
    // If the content looks like it already has HTML block tags, return as is
    if (/<p>|<div>|<h2>|<blockquote>|<ul>/i.test(rawContent)) {
      return rawContent;
    }

    // Otherwise, split by double newlines and wrap in <p> tags
    return rawContent
      .split(/\n\s*\n/)
      .filter(block => block.trim().length > 0)
      .map(block => `<p class="mb-6 font-serif text-lg leading-relaxed">${block.trim()}</p>`)
      .join('\n');
  };

  const handleSubmit = (e: React.FormEvent, overrideStatus?: PostStatus) => {
    e.preventDefault();

    const finalStatus = overrideStatus || status;

    // Show confirmation modal
    setPendingPublishStatus(finalStatus);
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    const finalStatus = pendingPublishStatus || status;
    const now = new Date();
    const dateString = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Process content to ensure audio feature works
    const formattedContent = formatContentForSave(content);

    const newPost: BlogPost = {
      id: editingPostId || Date.now().toString(),
      title,
      excerpt,
      content: formattedContent,
      author,
      date: dateString,
      tags: selectedTags,
      readTime,
      coverImage,
      status: finalStatus

    };

    onAddPost(newPost);

    // Reset form
    resetForm();

    // Close modal and show success message
    setShowPublishModal(false);
    setPendingPublishStatus(null);

    // Show success message
    setToastMessage(editingPostId
      ? `Post updated successfully as ${finalStatus}!`
      : `Post ${finalStatus === 'published' ? 'published' : 'saved as draft'} successfully!`
    );
  };

  const resetForm = () => {
    setEditingPostId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setSelectedTags([]);
    setNewTag('');
    setCoverImage(undefined);
    setStatus('published');
    setShowPreview(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setSelectedTags(post.tags);
    setAuthor(post.author);
    setReadTime(post.readTime);
    setCoverImage(post.coverImage);
    setStatus(post.status || 'published');
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      onDeletePost(postToDelete);
      setShowDeleteModal(false);
      setPostToDelete(null);
      setToastMessage('Post deleted successfully!');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const cancelPublish = () => {
    setShowPublishModal(false);
    setPendingPublishStatus(null);
  };

  // Filtering for Manage Tab
  const filteredManagePosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(manageSearch.toLowerCase()) || post.id.includes(manageSearch);
    const matchesFilter = manageFilter === 'all' || (post.status || 'published') === manageFilter;
    return matchesSearch && matchesFilter;
    // return matchSearch && matchesFilter onmessage(keyboardShortcut.value()); 
  });

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-zinc-200 shadow-lg p-6 lg:p-10">

            <div className="text-center mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-black text-white mb-4 lg:mb-6 shadow-md transform hover:scale-110 transition-transform duration-300">
                <BookOpen size={20} className="lg:w-6 lg:h-6" />
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl text-zinc-900 mb-2 lg:mb-3 tracking-tight">Welcome Back</h2>
              <p className="text-zinc-500 font-sans text-xs lg:text-sm">Enter your credentials to access the editorial desk.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access code..."
                    className="w-full px-4 py-2.5 lg:py-3 bg-white border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-300 placeholder:text-zinc-300 font-mono text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 lg:py-4 font-mono text-xs uppercase tracking-widest hover:bg-zinc-800 transform active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Access Dashboard</span>
                <Zap size={14} className="fill-white" />
              </button>
            </form>

            <div className="mt-6 lg:mt-8 text-center">
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Secure System • The Index
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-24 px-0 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink">Editorial Desk</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
            <Database size={12} />
            <span className="hidden sm:inline">DB: PostgreSQL</span>
            <span className="sm:hidden">DB</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-red-600 flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 lg:gap-8 border-b border-zinc-200 mb-6 lg:mb-10 overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        <button
          onClick={() => { setActiveTab('create'); resetForm(); }}
          className={`pb-3 font-mono text-[10px] lg:text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap ${activeTab === 'create' ? 'border-b-2 border-ink text-ink' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <Plus size={14} /> {editingPostId ? 'Edit Post' : 'Create New'}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`pb-3 font-mono text-[10px] lg:text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap ${activeTab === 'manage' ? 'border-b-2 border-ink text-ink' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <FileText size={14} /> Manage Posts
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 font-mono text-[10px] lg:text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap ${activeTab === 'appearance' ? 'border-b-2 border-ink text-ink' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <Palette size={14} /> Appearance
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 font-mono text-[10px] lg:text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap ${activeTab === 'templates' ? 'border-b-2 border-ink text-ink' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <LayoutIcon size={14} /> Templates
        </button>
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 sm:space-y-6 md:space-y-8 bg-white p-2 sm:p-5 md:p-8 lg:p-12 border-0 md:border border-zinc-100 shadow-none md:shadow-xl relative">

          {/* Editing indicator */}
          {editingPostId && (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-mono mb-4 sm:mb-0 sm:absolute sm:top-4 sm:left-4">
              <Edit size={12} />
              <span className="hidden xs:inline">Editing Post</span>
              <span className="xs:hidden">Editing</span>
            </div>
          )}

          {/* Status Toggle & Preview */}
          <div className="flex flex-wrap gap-2 justify-end sm:absolute sm:top-10 sm:right-10 z-10 mb-4 sm:mb-0">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-2 sm:px-3 py-1 text-[10px] uppercase tracking-widest border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded flex items-center gap-1"
            >
              {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
              <span className="hidden xs:inline">{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={`px-2 sm:px-3 py-1 text-[10px] uppercase tracking-widest border rounded ${status === 'draft' ? 'bg-zinc-200 border-zinc-300 text-black' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50'}`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={`px-2 sm:px-3 py-1 text-[10px] uppercase tracking-widest border rounded ${status === 'published' ? 'bg-green-100 border-green-200 text-green-800' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50'}`}
            >
              Public
            </button>
          </div>

          {/* Title Section */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif border-b border-zinc-200 py-2 sm:py-3 focus:outline-none focus:border-ink placeholder:text-zinc-200"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full font-serif border-b border-zinc-200 py-2 focus:outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                readOnly
                className="w-full font-serif border-b border-zinc-200 py-2 bg-zinc-50 text-zinc-600 cursor-not-allowed"
                title="Automatically calculated based on content"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4">Cover Image</label>

            {!coverImage ? (
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center hover:bg-zinc-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <ImageIcon size={32} />
                  <span className="font-mono text-xs">Click to upload cover image</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-zinc-100 rounded-lg overflow-hidden group">
                <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage(undefined)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg text-ink hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full font-serif border-b border-zinc-200 py-2 focus:outline-none focus:border-ink h-24 resize-none placeholder-zinc-300"
              placeholder="Brief summary..."
              required
            />
          </div>

          {/* Content Editor with Preview */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400">Content</label>
            </div>

            {showPreview ? (
              <div className="w-full border-2 border-zinc-200 p-6 min-h-[400px] rounded bg-white">
                <div className="prose prose-lg max-w-none font-serif" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            ) : (
              <TipTapEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your story... Use the rich toolbar above for formatting."
              />
            )}
            <p className="mt-2 text-[10px] text-zinc-400 font-mono">
              {showPreview ? 'Preview mode - Click "Edit" to continue editing' : 'Professional WYSIWYG editor with full formatting support'}
            </p>
          </div>

          {/* Smart Tags System */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              Tags
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-ink text-white px-3 py-1 rounded-full text-sm font-mono"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="w-full font-serif border-b border-zinc-200 py-2 focus:outline-none focus:border-ink"
              placeholder="Type to add or search tags..."
            />

            {/* Tag Suggestions */}
            {newTag && suggestedTags.length > 0 && (
              <div className="mt-2 p-3 bg-zinc-50 border border-zinc-200 rounded">
                <p className="text-xs font-mono text-zinc-500 mb-2">Suggestions from existing posts:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-2 py-1 bg-white border border-zinc-300 rounded text-sm font-mono hover:bg-ink hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Available Tags */}
            {!newTag && availableTags.length > 0 && (
              <div className="mt-2 p-3 bg-zinc-50 border border-zinc-200 rounded">
                <p className="text-xs font-mono text-zinc-500 mb-2">Available tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-2 py-1 bg-white border border-zinc-300 rounded text-sm font-mono hover:bg-ink hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-zinc-100">
            {editingPostId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-zinc-500 hover:text-zinc-700 font-mono text-xs uppercase tracking-widest"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className="bg-ink text-white px-8 py-3 font-mono text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2 ml-auto"
            >
              <Save size={16} /> {editingPostId ? 'Update Post' : (status === 'draft' ? 'Save Draft' : 'Publish Entry')}
            </button>
          </div>
        </form>
      ) : activeTab === 'manage' ? (
        /* Manage Tab */
        <div className="bg-white border border-zinc-100 shadow-xl min-h-[600px]">
          {/* Toolbar */}
          <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:border-ink"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setManageFilter('all')}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border ${manageFilter === 'all' ? 'bg-ink text-white border-ink' : 'border-zinc-200 text-zinc-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setManageFilter('published')}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border ${manageFilter === 'published' ? 'bg-ink text-white border-ink' : 'border-zinc-200 text-zinc-500'}`}
              >
                Published
              </button>
              <button
                onClick={() => setManageFilter('draft')}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border ${manageFilter === 'draft' ? 'bg-ink text-white border-ink' : 'border-zinc-200 text-zinc-500'}`}
              >
                Drafts
              </button>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-zinc-100">
            {filteredManagePosts.length > 0 ? (
              filteredManagePosts.map(post => (
                <div key={post.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-zinc-50 transition-colors group gap-3 sm:gap-0">
                  <div className="flex-1 w-full sm:pr-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      {post.status === 'draft' ? (
                        <span className="text-amber-500 flex-shrink-0"><CircleDashed size={14} /></span>
                      ) : (
                        <span className="text-green-500 flex-shrink-0"><CheckCircle size={14} /></span>
                      )}
                      <h3 className="font-serif text-base sm:text-lg truncate">{post.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-zinc-400 font-mono">
                      <span className="hidden sm:inline">{post.date}</span>
                      <span className="sm:hidden">{post.date.split(',')[0]}</span>
                      <span className="hidden md:inline">ID: {post.id}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-400 italic font-serif">
                No posts found matching your criteria.
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'appearance' ? (
        /* Appearance Tab */
        <div className="bg-white border border-zinc-100 shadow-xl p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
              <h3 className="font-serif text-3xl text-ink mb-4">Visual Identity</h3>
              <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Customize the journal's aesthetic</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-12">
              {availableThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setToastMessage(`Theme "${theme.name}" applied successfully!`);
                  }}
                  className={`group relative p-4 lg:p-6 border text-left transition-all duration-300 ${currentTheme.id === theme.id ? 'border-ink ring-1 ring-ink shadow-md' : 'border-zinc-200 hover:border-zinc-300 shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-3 lg:mb-4">
                    <span className={`font-serif text-lg lg:text-xl ${currentTheme.id === theme.id ? 'text-ink' : 'text-zinc-600'}`}>{theme.name}</span>
                    {currentTheme.id === theme.id && <CheckCircle size={16} className="text-ink flex-shrink-0 ml-2" />}
                  </div>

                  <div className="space-y-1.5 lg:space-y-2">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-zinc-200 flex-shrink-0" style={{ backgroundColor: theme.colors.paper }}></div>
                      <span className="text-[10px] lg:text-xs font-mono text-zinc-400 uppercase">Paper</span>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-zinc-200 flex-shrink-0" style={{ backgroundColor: theme.colors.ink }}></div>
                      <span className="text-[10px] lg:text-xs font-mono text-zinc-400 uppercase">Ink</span>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-zinc-200 flex-shrink-0" style={{ backgroundColor: theme.colors.accent }}></div>
                      <span className="text-[10px] lg:text-xs font-mono text-zinc-400 uppercase">Accent</span>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-zinc-100">
                    <p className="font-serif text-xs lg:text-sm opacity-70" style={{ color: theme.colors.ink }}>
                      "The library is a growing organism."
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-zinc-50 p-4 lg:p-8 border border-zinc-200 rounded-lg space-y-6 lg:space-y-8">

              {/* Layout Section */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 lg:mb-4 flex items-center gap-2">
                  <LayoutIcon size={14} /> Layout Structure
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                  {(['classic', 'grid', 'magazine', 'minimal'] as LayoutTemplate[]).map(layout => (
                    <button
                      key={layout}
                      onClick={() => updateThemeLayout(layout)}
                      className={`p-3 lg:p-4 border text-center transition-all ${currentTheme.layout === layout ? 'bg-white border-ink shadow-sm' : 'border-zinc-200 hover:border-zinc-300'}`}
                    >
                      <span className="capitalize font-serif text-sm lg:text-lg">{layout}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Section */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 lg:mb-4 flex items-center gap-2">
                  <Type size={14} /> Typography
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">Serif (Headings)</label>
                    <select
                      value={currentTheme.fonts.serif}
                      onChange={(e) => updateThemeFonts({ serif: e.target.value })}
                      className="w-full p-2.5 lg:p-2 bg-white border border-zinc-200 text-sm font-serif focus:border-ink focus:outline-none"
                    >
                      <option value='"Cormorant Garamond"'>Cormorant Garamond</option>
                      <option value='"Merriweather"'>Merriweather</option>
                      <option value='"Lora"'>Lora</option>
                      <option value='"Playfair Display"'>Playfair Display</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">Sans (Body)</label>
                    <select
                      value={currentTheme.fonts.sans}
                      onChange={(e) => updateThemeFonts({ sans: e.target.value })}
                      className="w-full p-2.5 lg:p-2 bg-white border border-zinc-200 text-sm font-sans focus:border-ink focus:outline-none"
                    >
                      <option value='"Inter"'>Inter</option>
                      <option value='"Roboto"'>Roboto</option>
                      <option value='"Open Sans"'>Open Sans</option>
                      <option value='"Space Mono"'>Space Mono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">Mono (UI)</label>
                    <select
                      value={currentTheme.fonts.mono}
                      onChange={(e) => updateThemeFonts({ mono: e.target.value })}
                      className="w-full p-2.5 lg:p-2 bg-white border border-zinc-200 text-sm font-mono focus:border-ink focus:outline-none"
                    >
                      <option value='"JetBrains Mono"'>JetBrains Mono</option>
                      <option value='"Fira Code"'>Fira Code</option>
                      <option value='"Space Mono"'>Space Mono</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scale & Radius Section */}
              <div className="grid grid-cols-1 gap-6 lg:gap-8">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 lg:mb-4 flex items-center gap-2">
                    <Maximize size={14} /> Scale
                  </h4>
                  <div className="grid grid-cols-5 gap-1.5 lg:gap-2">
                    {(['0.9', '0.95', '1', '1.05', '1.1'] as const).map(scale => (
                      <button
                        key={scale}
                        onClick={() => updateThemeScale(parseFloat(scale) as ThemeScale)}
                        className={`py-2.5 lg:py-2 border text-[10px] lg:text-xs font-mono transition-all ${currentTheme.scale === parseFloat(scale) ? 'bg-ink text-white border-ink' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
                      >
                        {Math.round(parseFloat(scale) * 100)}%
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 lg:mb-4 flex items-center gap-2">
                    <Square size={14} /> Border Radius
                  </h4>
                  <div className="grid grid-cols-5 gap-1.5 lg:gap-2">
                    {(['none', 'sm', 'md', 'lg', 'full'] as BorderRadius[]).map(radius => (
                      <button
                        key={radius}
                        onClick={() => updateThemeRadius(radius)}
                        className={`py-2.5 lg:py-2 border text-[10px] lg:text-xs font-mono capitalize transition-all ${currentTheme.borderRadius === radius ? 'bg-ink text-white border-ink' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colors Section */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 lg:mb-4 flex items-center gap-2">
                  <Palette size={14} /> Color Palette
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={currentTheme.colors.accent}
                        onChange={(e) => updateThemeColors({ accent: e.target.value })}
                        className="w-12 h-12 lg:w-10 lg:h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="font-mono text-sm text-zinc-600">{currentTheme.colors.accent}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">Ink Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={currentTheme.colors.ink}
                        onChange={(e) => updateThemeColors({ ink: e.target.value })}
                        className="w-12 h-12 lg:w-10 lg:h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="font-mono text-sm text-zinc-600">{currentTheme.colors.ink}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : activeTab === 'templates' ? (
        <div className="bg-white border border-zinc-100 shadow-xl p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 lg:mb-10 text-center">
              <h3 className="font-serif text-2xl lg:text-3xl text-ink mb-3 lg:mb-4">Pre-made Templates</h3>
              <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Professional designs ready to use</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-10 lg:mb-12 overflow-x-auto whitespace-nowrap">
              {PREMADE_TEMPLATES.map(template => {
                const IconComponent = template.previewIcon === 'BookOpen' ? BookOpen :
                  template.previewIcon === 'Sparkles' ? Sparkles : Zap;
                return (
                  <div
                    key={template.id}
                    className="group border border-zinc-200 hover:border-ink transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="h-32 lg:h-40 flex items-center justify-center"
                      style={{ backgroundColor: template.theme.colors.mist }}
                    >
                      <IconComponent size={48} style={{ color: template.theme.colors.accent }} />
                    </div>

                    <div className="p-4 lg:p-6">
                      <h4 className="font-serif text-lg lg:text-xl text-ink mb-2">{template.name}</h4>
                      <p className="text-xs lg:text-sm text-zinc-500 mb-4 line-clamp-2">{template.description}</p>

                      <div className="flex gap-1.5 mb-4">
                        <div className="w-6 h-6 rounded-full border border-zinc-200" style={{ backgroundColor: template.theme.colors.paper }}></div>
                        <div className="w-6 h-6 rounded-full border border-zinc-200" style={{ backgroundColor: template.theme.colors.ink }}></div>
                        <div className="w-6 h-6 rounded-full border border-zinc-200" style={{ backgroundColor: template.theme.colors.accent }}></div>
                      </div>

                      <button
                        onClick={() => {
                          const { theme } = template;
                          updateThemeLayout(theme.layout);
                          updateThemeColors(theme.colors);
                          updateThemeFonts(theme.fonts);
                          updateThemeRadius(theme.borderRadius);
                          updateThemeScale(theme.scale as ThemeScale);
                          setToastMessage(`Template "${template.name}" applied successfully!`);
                        }}
                        className="w-full bg-ink text-white py-2.5 lg:py-2 text-xs font-mono uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                      >
                        Apply Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-4 lg:p-6 rounded-lg">
              <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                <Type size={14} /> Template Editor
              </h4>
              <p className="text-sm text-zinc-600 mb-4">
                After applying a template, you can further customize it in the <strong>Appearance</strong> tab. All changes are saved automatically.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-600">Instant preview</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-600">Full customization</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-600">Auto-save enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-black">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-black rounded-full">
                <AlertTriangle size={24} className="text-white" />
              </div>
              <h3 className="font-serif text-2xl text-black">Delete Post?</h3>
            </div>

            <p className="text-zinc-700 mb-6 font-serif leading-relaxed">
              Are you sure you want to delete this post? This action cannot be undone.
              All comments and reactions associated with this post will also be removed.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 border-2 border-black text-black font-mono text-xs uppercase tracking-widest hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-black">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-black">
                {pendingPublishStatus === 'published' ? (
                  <CheckCircle size={24} className="text-white" />
                ) : (
                  <CircleDashed size={24} className="text-white" />
                )}
              </div>
              <h3 className="font-serif text-2xl text-black">
                {editingPostId ? 'Update Post?' : (pendingPublishStatus === 'published' ? 'Publish Post?' : 'Save as Draft?')}
              </h3>
            </div>

            <p className="text-zinc-700 mb-6 font-serif leading-relaxed">
              {pendingPublishStatus === 'published'
                ? 'This post will be immediately visible to all readers. Make sure all content is ready for publication.'
                : 'This post will be saved as a draft. You can edit and publish it later from the Manage Posts tab.'}
            </p>

            <div className="bg-zinc-50 p-4 mb-6 border-l-4 border-black">
              <p className="text-sm font-mono text-zinc-700">
                <strong>Title:</strong> {title || 'Untitled'}
              </p>
              <p className="text-sm font-mono text-zinc-700 mt-1">
                <strong>Author:</strong> {author}
              </p>
              <p className="text-sm font-mono text-zinc-700 mt-1">
                <strong>Read Time:</strong> {readTime}
              </p>
              <p className="text-sm font-mono text-zinc-700 mt-1">
                <strong>Tags:</strong> {selectedTags.join(', ') || 'None'}
              </p>
              <p className="text-sm font-mono text-zinc-700 mt-1">
                <strong>Status:</strong> {pendingPublishStatus === 'published' ? 'Published' : 'Draft'}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelPublish}
                className="px-6 py-2 border-2 border-black text-black font-mono text-xs uppercase tracking-widest hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPublish}
                className="px-6 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Save size={14} />
                {editingPostId ? 'Update Now' : (pendingPublishStatus === 'published' ? 'Publish Now' : 'Save Draft')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
