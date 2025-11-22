# LIS Journal - Diagnostic Report & Fix Guide

## Issues Found

### 1. ❌ Backend Server Not Running
The Node.js backend server is not currently running. This is why publishing posts fails.

### 2. ⚠️ API Keys Configuration
The server needs the following environment variables configured in `server/.env`:
- `GEMINI_API_KEY` - For AI features (librarian chat, text-to-speech)
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (optional, defaults to 3001)

### 3. ⚠️ Database Connection
PostgreSQL database needs to be running and accessible.

## Current Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```
**Issue**: Port mismatch! Server runs on port 3001 by default, but frontend expects 3000.

### Server (.env)
This file is gitignored, so I cannot view it directly. You need to ensure it contains:
```
DATABASE_URL=postgresql://username:password@localhost:5432/lis_journal
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

## Step-by-Step Fix

### Step 1: Fix Frontend API URL
Update the frontend `.env` file to match the server port.

### Step 2: Configure Server Environment Variables
Create/update `server/.env` with your credentials.

### Step 3: Ensure PostgreSQL is Running
Make sure PostgreSQL is installed and running on your system.

### Step 4: Start the Backend Server
Navigate to the `server` directory and run:
```bash
npm run dev
```

### Step 5: Start the Frontend
In the root directory, run:
```bash
npm run dev
```

## Quick Checklist

- [ ] PostgreSQL installed and running
- [ ] `server/.env` file exists with all required keys
- [ ] Frontend `.env` has correct API URL
- [ ] Backend server is running (port 3001)
- [ ] Frontend dev server is running
- [ ] Can access http://localhost:3001/api/health

## Common Errors & Solutions

### "Failed to save post"
- **Cause**: Backend server not running or wrong API URL
- **Fix**: Start backend server and verify API URL in frontend `.env`

### "Database connection error"
- **Cause**: PostgreSQL not running or wrong DATABASE_URL
- **Fix**: Start PostgreSQL and verify connection string

### "GEMINI_API_KEY not found"
- **Cause**: Missing API key in server/.env
- **Fix**: Add your Gemini API key to server/.env

## Testing the Fix

1. Test backend health: `curl http://localhost:3001/api/health`
2. Try publishing a post from the admin panel
3. Check browser console for any errors
4. Check server terminal for error logs
