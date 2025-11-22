
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

export interface Translations {
  searchPlaceholder: string;
  currentIssue: string;
  archives: string;
  masthead: string;
  readEntry: string;
  backToIndex: string;
  published: string;
  author: string;
  time: string;
  endOfEntry: string;
  comments: string;
  postComment: string;
  namePlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  noComments: string;
  sortBy: string;
  newest: string;
  oldest: string;
  relatedEntries: string;
  classProject: string;
  course: string;
  creator: string;
  aboutText: string;
  admin: string;
  login: string;
  createPost: string;
}