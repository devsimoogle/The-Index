
import { BlogPost, Language, Comment } from '../types';
import { BLOG_POSTS } from '../constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SESSION_KEY = 'lis_journal_admin_session';

// Helper for safe localStorage access (only for session management)
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // SecurityError or similar
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) { }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) { }
  }
};

export const storageService = {
  // Initialize - now just ensures backend is reachable
  init: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        console.warn('Backend API not available, using fallback data');
      }
    } catch (e) {
      console.warn("Backend API not available:", e);
    }
  },

  // --- POSTS OPERATIONS ---

  getPosts: async (): Promise<Record<Language, BlogPost[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();

      // Ensure all languages are present
      const languages: Language[] = ['en', 'ig', 'yo', 'ha'];
      languages.forEach(lang => {
        if (!data[lang]) {
          data[lang] = [];
        }
      });

      return data;
    } catch (e) {
      console.error("Error fetching posts from API:", e);
      // Fallback to default posts if API fails
      return BLOG_POSTS;
    }
  },

  savePost: async (post: BlogPost): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }
    } catch (e) {
      console.error("Failed to save post:", e);
      throw e;
    }
  },

  deletePost: async (postId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (e) {
      console.error("Failed to delete post:", e);
      throw e;
    }
  },

  // --- COMMENTS OPERATIONS ---

  getComments: async (): Promise<Record<string, Comment[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();

      // Convert date strings to Date objects
      const revived: Record<string, Comment[]> = {};
      Object.keys(data).forEach(postId => {
        if (Array.isArray(data[postId])) {
          revived[postId] = data[postId].map((c: any) => ({
            ...c,
            date: new Date(c.date)
          }));
        }
      });

      return revived;
    } catch (e) {
      console.error("Error fetching comments:", e);
      return {};
    }
  },

  saveComment: async (comment: Comment): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error('Failed to save comment');
      }
    } catch (e) {
      console.error("Failed to save comment:", e);
      throw e;
    }
  },

  // --- AUTH OPERATIONS ---

  checkAdminSession: (): boolean => {
    try {
      return safeLocalStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setAdminSession: () => {
    safeLocalStorage.setItem(SESSION_KEY, 'true');
  },

  clearAdminSession: () => {
    safeLocalStorage.removeItem(SESSION_KEY);
  }
};
