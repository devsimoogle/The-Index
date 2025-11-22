# Quick Start Guide - PostgreSQL Setup

## Step-by-Step Setup Instructions

### 1. Install PostgreSQL (if not already installed)

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run the installer
- Remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create the Database

Open a terminal and run:

```bash
# Connect to PostgreSQL (Windows: use SQL Shell (psql) from Start menu)
psql -U postgres

# You'll be prompted for the postgres user password
# Then run these commands:

CREATE DATABASE lis_journal;
\c lis_journal
\q
```

### 3. Configure Environment Variables

**Backend Configuration:**

Create `server/.env` file:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your details:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lis_journal
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3001
NODE_ENV=development
```

**Get a Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

**Frontend Configuration:**

Create `.env.local` in the root directory:
```bash
cd ..
cp .env.example .env.local
```

The default values should work:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 5. Start the Application

Open **TWO terminal windows**:

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

Wait for:
```
✓ Connected to PostgreSQL database
✓ Database schema initialized successfully
✓ Server running on http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

The app will open at: http://localhost:5173

### 6. (Optional) Seed Sample Data

If you want some initial blog posts:

```bash
psql -U postgres -d lis_journal -f server/seed.sql
```

## Troubleshooting

### "Connection refused" error
- Make sure PostgreSQL is running
- Check your DATABASE_URL in server/.env
- Verify the password is correct

### "Port 3001 already in use"
- Change PORT in server/.env to 3002
- Update VITE_API_URL in .env.local to http://localhost:3002/api

### "Cannot find module" errors
- Delete node_modules folders
- Run `npm install` again in both root and server directories

### Database connection string format
```
postgresql://[username]:[password]@[host]:[port]/[database]

Example:
postgresql://postgres:mypassword@localhost:5432/lis_journal
```

## Testing the Setup

1. Open http://localhost:5173
2. You should see the journal homepage
3. Try the AI Librarian chatbot (bottom right)
4. Go to Admin Panel (footer) to create posts

## Next Steps

- Read the main README.md for detailed documentation
- Explore the API endpoints at http://localhost:3001/api/health
- Customize the content and styling to your needs

---

**Need Help?**
- Check the main README.md
- Review the PostgreSQL logs
- Verify all environment variables are set correctly
