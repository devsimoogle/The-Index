import { pool } from './db.js';

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
    language: string;
}

export interface Comment {
    id: string;
    postId: string;
    author: string;
    content: string;
    date: Date;
}

export const postService = {
    // Get all posts for a specific language
    async getPosts(language: string = 'en'): Promise<BlogPost[]> {
        const result = await pool.query(
            `SELECT 
        id, title, excerpt, content, author, 
        date, tags, read_time as "readTime", 
        cover_image as "coverImage", status, language
      FROM posts 
      WHERE language = $1 
      ORDER BY date DESC`,
            [language]
        );
        return result.rows;
    },

    // Get posts for all languages
    async getAllPosts(): Promise<Record<string, BlogPost[]>> {
        const result = await pool.query(
            `SELECT 
        id, title, excerpt, content, author, 
        date, tags, read_time as "readTime", 
        cover_image as "coverImage", status, language
      FROM posts 
      ORDER BY date DESC`
        );

        const postsByLanguage: Record<string, BlogPost[]> = {
            en: [],
            ig: [],
            yo: [],
            ha: []
        };

        result.rows.forEach((post) => {
            const lang = post.language || 'en';
            if (!postsByLanguage[lang]) {
                postsByLanguage[lang] = [];
            }
            postsByLanguage[lang].push(post);
        });

        return postsByLanguage;
    },

    // Get a single post by ID
    async getPostById(id: string): Promise<BlogPost | null> {
        const result = await pool.query(
            `SELECT 
        id, title, excerpt, content, author, 
        date, tags, read_time as "readTime", 
        cover_image as "coverImage", status, language
      FROM posts 
      WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    // Create or update a post
    async savePost(post: BlogPost): Promise<BlogPost> {
        const existing = await this.getPostById(post.id);

        if (existing) {
            // Update existing post
            const result = await pool.query(
                `UPDATE posts 
        SET title = $1, excerpt = $2, content = $3, author = $4, 
            date = $5, tags = $6, read_time = $7, cover_image = $8, 
            status = $9, language = $10, updated_at = NOW()
        WHERE id = $11
        RETURNING 
          id, title, excerpt, content, author, 
          date, tags, read_time as "readTime", 
          cover_image as "coverImage", status, language`,
                [
                    post.title, post.excerpt, post.content, post.author,
                    post.date, post.tags, post.readTime, post.coverImage,
                    post.status || 'published', post.language || 'en', post.id
                ]
            );
            return result.rows[0];
        } else {
            // Insert new post
            const result = await pool.query(
                `INSERT INTO posts 
        (id, title, excerpt, content, author, date, tags, read_time, cover_image, status, language)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING 
          id, title, excerpt, content, author, 
          date, tags, read_time as "readTime", 
          cover_image as "coverImage", status, language`,
                [
                    post.id, post.title, post.excerpt, post.content, post.author,
                    post.date, post.tags, post.readTime, post.coverImage,
                    post.status || 'published', post.language || 'en'
                ]
            );
            return result.rows[0];
        }
    },

    // Delete a post
    async deletePost(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
};

export const commentService = {
    // Get comments for a post
    async getComments(postId: string): Promise<Comment[]> {
        const result = await pool.query(
            `SELECT id, post_id as "postId", author, content, date 
      FROM comments 
      WHERE post_id = $1 
      ORDER BY date ASC`,
            [postId]
        );
        return result.rows;
    },

    // Get all comments grouped by post ID
    async getAllComments(): Promise<Record<string, Comment[]>> {
        const result = await pool.query(
            `SELECT id, post_id as "postId", author, content, date 
      FROM comments 
      ORDER BY date ASC`
        );

        const commentsByPost: Record<string, Comment[]> = {};
        result.rows.forEach((comment) => {
            if (!commentsByPost[comment.postId]) {
                commentsByPost[comment.postId] = [];
            }
            commentsByPost[comment.postId].push(comment);
        });

        return commentsByPost;
    },

    // Save a comment
    async saveComment(comment: Comment): Promise<Comment> {
        const result = await pool.query(
            `INSERT INTO comments (id, post_id, author, content, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, post_id as "postId", author, content, date`,
            [comment.id, comment.postId, comment.author, comment.content, comment.date]
        );
        return result.rows[0];
    }
};

export const reactionService = {
    // Get reactions for a post
    async getReactions(postId: string): Promise<Record<string, number>> {
        const result = await pool.query(
            `SELECT reaction_type, count 
      FROM reactions 
      WHERE post_id = $1`,
            [postId]
        );

        const reactions: Record<string, number> = {
            heart: 0,
            insightful: 0,
            bookmark: 0
        };

        result.rows.forEach((row) => {
            reactions[row.reaction_type] = row.count;
        });

        return reactions;
    },

    // Increment a reaction
    async incrementReaction(postId: string, reactionType: string): Promise<void> {
        await pool.query(
            `INSERT INTO reactions (post_id, reaction_type, count)
      VALUES ($1, $2, 1)
      ON CONFLICT (post_id, reaction_type)
      DO UPDATE SET count = reactions.count + 1`,
            [postId, reactionType]
        );
    }
};
