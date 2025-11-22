import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db.js';
import { postService, commentService, reactionService } from './services.js';
import { askLibrarian, generateBlogSpeech } from './geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow all vercel.app domains
        if (origin && origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Allow configured origins
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'LIS Journal API is running' });
});

// ===== POSTS ENDPOINTS =====

// Get all posts (grouped by language)
app.get('/api/posts', async (req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get posts by language
app.get('/api/posts/:language', async (req: Request, res: Response) => {
    try {
        const { language } = req.params;
        const posts = await postService.getPosts(language);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get single post by ID
app.get('/api/post/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Create or update a post
app.post('/api/posts', async (req: Request, res: Response) => {
    try {
        const post = req.body;
        const savedPost = await postService.savePost(post);
        res.json(savedPost);
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Failed to save post' });
    }
});

// Delete a post
app.delete('/api/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await postService.deletePost(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// ===== COMMENTS ENDPOINTS =====

// Get all comments
app.get('/api/comments', async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getAllComments();
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Get comments for a specific post
app.get('/api/comments/:postId', async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getComments(postId);
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add a comment
app.post('/api/comments', async (req: Request, res: Response) => {
    try {
        const comment = req.body;
        const savedComment = await commentService.saveComment(comment);
        res.json(savedComment);
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ error: 'Failed to save comment' });
    }
});

// ===== REACTIONS ENDPOINTS =====

// Get reactions for a post
app.get('/api/reactions/:postId', async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const reactions = await reactionService.getReactions(postId);
        res.json(reactions);
    } catch (error) {
        console.error('Error fetching reactions:', error);
        res.status(500).json({ error: 'Failed to fetch reactions' });
    }
});

// Increment a reaction
app.post('/api/reactions/:postId/:type', async (req: Request, res: Response) => {
    try {
        const { postId, type } = req.params;
        await reactionService.incrementReaction(postId, type);
        const reactions = await reactionService.getReactions(postId);
        res.json(reactions);
    } catch (error) {
        console.error('Error updating reaction:', error);
        res.status(500).json({ error: 'Failed to update reaction' });
    }
});

// ===== GEMINI AI ENDPOINTS =====

// Ask the librarian
app.post('/api/librarian/ask', async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const response = await askLibrarian(query);
        res.json(response);
    } catch (error) {
        console.error('Error asking librarian:', error);
        res.status(500).json({ error: 'Failed to get response from librarian' });
    }
});

// Generate speech
app.post('/api/speech/generate', async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const audioData = await generateBlogSpeech(text);
        if (!audioData) {
            return res.status(500).json({ error: 'Failed to generate speech' });
        }
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioData));
    } catch (error) {
        console.error('Error generating speech:', error);
        res.status(500).json({ error: 'Failed to generate speech' });
    }
});

// Initialize database and start server
async function startServer() {
    try {
        console.log('Initializing database...');
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
