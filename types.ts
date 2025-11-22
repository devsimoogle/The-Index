
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
  coverImage?: string;
  status?: 'published' | 'draft';
  language?: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: Date;
}

export type Language = 'en' | 'ig' | 'yo' | 'ha';

export type SortOrder = 'newest' | 'oldest';

export enum ViewState {
  HOME = 'HOME',
  POST = 'POST',
  ARCHIVE = 'ARCHIVE',
  MASTHEAD = 'MASTHEAD',
  ADMIN = 'ADMIN',
}

export type ReactionType = 'heart' | 'insightful' | 'bookmark';
export type PostReactions = Record<string, Record<ReactionType, number>>;