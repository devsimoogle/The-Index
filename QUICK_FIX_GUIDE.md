# Quick Fix Guide for Publishing Issues

## Problem Summary
Publishing posts from the admin panel is not working because:
1. ❌ Backend server is not running
2. ⚠️ API keys may not be configured
3. ⚠️ Port mismatch between frontend and backend (FIXED)

## What I've Fixed
✅ Updated frontend `.env` to use correct port (3001 instead of 3000)
✅ Created `.env.example` template for server configuration

## What You Need to Do

### Step 1: Configure Server Environment Variables

1. Navigate to the `server` folder
2. Create a file named `.env` (copy from `.env.example`)
3. Add your credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lis_journal
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3001
NODE_ENV=development
```

**Where to get your Gemini API Key:**
- Visit: https://aistudio.google.com/app/apikey
- Create a new API key
- Copy and paste it into the `.env` file

**Database URL format:**
```
postgresql://username:password@host:port/database_name
```

### Step 2: Ensure PostgreSQL is Running

Check if PostgreSQL is installed and running:
```powershell
Get-Service -Name postgresql*
```

If not running, start it:
```powershell
Start-Service postgresql-x64-XX  # Replace XX with your version
```

Or use pgAdmin to start the database.

### Step 3: Start the Backend Server

Open a terminal in the `server` folder and run:
```bash
npm run dev
```

You should see:
```
✓ Connected to PostgreSQL database
✓ Database schema initialized successfully
✓ Server running on http://localhost:3001
✓ API endpoints available at http://localhost:3001/api
```

### Step 4: Start the Frontend

Open another terminal in the root folder and run:
```bash
npm run dev
```

### Step 5: Test Publishing

1. Go to the admin panel
2. Create a new post
3. Click "Publish Entry"
4. Check the browser console (F12) for any errors

## Troubleshooting

### Error: "Failed to save post"
**Cause:** Backend server not running or wrong API URL
**Fix:** Make sure backend is running on port 3001

### Error: "Database connection error"
**Cause:** PostgreSQL not running or wrong DATABASE_URL
**Fix:** 
- Start PostgreSQL service
- Verify DATABASE_URL in server/.env
- Create database if it doesn't exist:
  ```sql
  CREATE DATABASE lis_journal;
  ```

### Error: "GEMINI_API_KEY not found"
**Cause:** Missing or invalid API key
**Fix:** Add valid Gemini API key to server/.env

### Port 3001 already in use
**Cause:** Another process using the port
**Fix:** 
- Find and stop the process, or
- Change PORT in server/.env to another port (e.g., 3002)
- Update VITE_API_URL in frontend .env to match

## Quick Test Commands

Test backend health:
```powershell
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok","message":"LIS Journal API is running"}
```

## Need More Help?

Check the browser console (F12) and server terminal for specific error messages.
Common issues are usually:
1. Server not running
2. Wrong API URL
3. Database not connected
4. Missing API keys
