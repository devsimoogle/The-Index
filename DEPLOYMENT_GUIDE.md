# 🚀 LIS Journal - Deployment Guide

This guide covers deploying your LIS Journal application to production. Since your app has both a frontend (React/Vite) and a backend (Node.js/Express with PostgreSQL), you have several hosting options.

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Option 1: Vercel + Railway (Recommended)](#option-1-vercel--railway-recommended)
3. [Option 2: Render (Full Stack)](#option-2-render-full-stack)
4. [Option 3: Vercel + Heroku](#option-3-vercel--heroku)
5. [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## Architecture Overview

Your application consists of:
- **Frontend**: React + Vite (Static Site)
- **Backend**: Node.js + Express API
- **Database**: PostgreSQL

**Important**: Vercel is excellent for frontend hosting but **cannot host the backend** because:
- Vercel is designed for serverless functions and static sites
- Your Express server needs to run continuously
- PostgreSQL requires a persistent connection

**Solution**: Deploy frontend on Vercel, backend on Railway/Render/Heroku

---

## Option 1: Vercel + Railway (Recommended) ⭐

This is the **best free option** with excellent performance.

### Part A: Deploy Backend to Railway

Railway offers free PostgreSQL hosting and Node.js deployment.

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

#### Step 2: Deploy Backend

1. **Create New Project** → "Deploy from GitHub repo"
2. **Connect your repository** (or create one first)
3. **Configure the service**:
   - Root Directory: `/server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create a database
   - Copy the `DATABASE_URL` from the database settings

5. **Set Environment Variables**:
   Go to your backend service → Variables → Add:
   ```
   DATABASE_URL=<from Railway PostgreSQL>
   GEMINI_API_KEY=<your Gemini API key>
   PORT=3001
   NODE_ENV=production
   ```

6. **Deploy**:
   - Railway will auto-deploy
   - Note your backend URL (e.g., `https://your-app.up.railway.app`)

#### Step 3: Seed the Database

After deployment, run the seed script:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed
railway run npm run seed
```

### Part B: Deploy Frontend to Vercel

#### Step 1: Prepare Frontend

1. Update `.env` with your Railway backend URL:
   ```env
   VITE_API_URL=https://your-app.up.railway.app/api
   ```

2. Create `vercel.json` in the root directory:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-app.up.railway.app/api
   ```

7. Click **Deploy**!

Your app will be live at: `https://your-project.vercel.app`

---

## Option 2: Render (Full Stack)

Render can host both frontend and backend on one platform.

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Configure:
   - Name: `lis-journal-db`
   - Database: `lis_journal`
   - User: `lis_journal_user`
   - Region: Choose closest to you
   - Plan: **Free**

3. Click "Create Database"
4. Copy the **Internal Database URL**

### Step 3: Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `lis-journal-api`
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   DATABASE_URL=<from Render PostgreSQL>
   GEMINI_API_KEY=<your key>
   PORT=3001
   NODE_ENV=production
   ```

5. Click "Create Web Service"
6. Note your backend URL (e.g., `https://lis-journal-api.onrender.com`)

### Step 4: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `lis-journal`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://lis-journal-api.onrender.com/api
   ```

5. Click "Create Static Site"

Your app will be live at: `https://lis-journal.onrender.com`

---

## Option 3: Vercel + Heroku

### Deploy Backend to Heroku

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login and create app:
   ```bash
   heroku login
   cd server
   heroku create lis-journal-api
   ```

3. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. Set environment variables:
   ```bash
   heroku config:set GEMINI_API_KEY=your_key
   heroku config:set NODE_ENV=production
   ```

5. Create `Procfile` in server directory:
   ```
   web: npm start
   ```

6. Deploy:
   ```bash
   git subtree push --prefix server heroku main
   ```

7. Seed database:
   ```bash
   heroku run npm run seed
   ```

### Deploy Frontend to Vercel
Follow the same steps as Option 1, Part B.

---

## Pre-Deployment Checklist

### Backend Preparation

1. **Update CORS settings** in `server/src/index.ts`:
   ```typescript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-frontend.vercel.app',
       'https://your-frontend.onrender.com'
     ],
     credentials: true
   }));
   ```

2. **Ensure build script works**:
   ```bash
   cd server
   npm run build
   npm start
   ```

3. **Test database connection** with production DATABASE_URL

### Frontend Preparation

1. **Update API URL** in `.env`:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. **Test build**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Check environment variables** are prefixed with `VITE_`

### Database Preparation

1. **Backup your local database**:
   ```bash
   pg_dump lis_journal > backup.sql
   ```

2. **Test seed script**:
   ```bash
   cd server
   npm run seed
   ```

---

## Post-Deployment

### 1. Seed Production Database

After backend is deployed:
```bash
# Railway
railway run npm run seed

# Render
# Use the Shell tab in Render dashboard
npm run seed

# Heroku
heroku run npm run seed
```

### 2. Test Your Application

1. Visit your frontend URL
2. Check if posts load
3. Test admin login
4. Try creating a new post
5. Test comments and reactions
6. Verify AI features (librarian, audio)

### 3. Set Up Custom Domain (Optional)

**Vercel**:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

**Railway/Render**:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Troubleshooting

### "Failed to fetch posts"
- Check if backend is running
- Verify VITE_API_URL is correct
- Check CORS settings

### "Database connection error"
- Verify DATABASE_URL is correct
- Check if database is running
- Ensure IP whitelist (if applicable)

### "Build failed"
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

### "API key not found"
- Ensure GEMINI_API_KEY is set in backend environment
- Check environment variable names (no typos)

---

## Cost Breakdown

### Free Tier Limits

**Railway**:
- $5 free credit/month
- ~500 hours of runtime
- 1GB RAM
- PostgreSQL included

**Render**:
- Free tier available
- 750 hours/month
- 512MB RAM
- PostgreSQL: 90 days free, then $7/month

**Vercel**:
- 100GB bandwidth/month
- Unlimited deployments
- Free SSL

**Recommendation**: Railway + Vercel for best free tier experience!

---

## Quick Deploy Commands

### Railway
```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Vercel
```bash
# Install CLI
npm i -g vercel

# Deploy
vercel
```

---

## Need Help?

Common issues and solutions:
1. **CORS errors**: Update backend CORS configuration
2. **Environment variables not working**: Ensure they're prefixed with `VITE_` for frontend
3. **Database connection timeout**: Check DATABASE_URL and firewall settings
4. **Build failures**: Check Node.js version (use v18 or v20)

---

**Congratulations! Your LIS Journal is now live! 🎉**

Share your deployed URL and showcase your amazing library science journal to the world!
