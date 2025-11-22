# Database Seeding Guide

This guide will help you populate your database with the initial blog posts and content.

## What Gets Seeded

The seed script will add:
- **6 Blog Posts** covering topics like:
  - The Sentient Catalogue: Predictive Access Control
  - Quantum Archives: Beyond the Binary
  - The Zero-Carbon Archive: Storing Data in DNA
  - Preserving Oral Histories in the Age of Deepfakes
  - Neural Interfaces and the End of the Search Bar
  - The Library as a Sentient Being: IoT Integration

- **7 Sample Comments** from various authors
- **Reaction counts** (hearts, insightful, bookmarks) for all posts

## How to Seed the Database

### Option 1: Using the npm script (Recommended)

1. Make sure your backend server is **NOT** running (stop it if it's running)
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Run the seed script:
   ```bash
   npm run seed
   ```

4. You should see output like:
   ```
   🌱 Starting database seeding...
   ✓ Blog posts inserted
   ✓ Comments inserted
   ✓ Reactions inserted
   🎉 Database seeded successfully!
   ```

5. Start your backend server again:
   ```bash
   npm run dev
   ```

6. Refresh your frontend application to see all the content!

### Option 2: Using psql directly

If you prefer to use PostgreSQL's command-line tool:

1. Open your terminal
2. Navigate to the server directory
3. Run:
   ```bash
   psql -U postgres -d lis_journal -f seed-full.sql
   ```
   (Replace `postgres` with your PostgreSQL username if different)

## Important Notes

⚠️ **The seed script does NOT clear existing data by default**

If you want to start fresh:
1. Open `seed-full.sql`
2. Uncomment line 5:
   ```sql
   TRUNCATE TABLE reactions, comments, posts RESTART IDENTITY CASCADE;
   ```
3. Run the seed script again

This will delete all existing posts, comments, and reactions before adding the seed data.

## Troubleshooting

### "Database connection error"
- Make sure PostgreSQL is running
- Verify your DATABASE_URL in server/.env

### "Duplicate key error"
- The posts already exist in your database
- Either skip seeding or uncomment the TRUNCATE line to clear existing data first

### "Permission denied"
- Make sure your database user has INSERT permissions
- Check your DATABASE_URL credentials

## Verifying the Seed

After seeding, you can verify the data:

```sql
-- Check posts
SELECT COUNT(*) FROM posts;

-- Check comments
SELECT COUNT(*) FROM comments;

-- Check reactions
SELECT COUNT(*) FROM reactions;
```

You should see:
- 6 posts
- 7 comments
- 18 reactions (3 types × 6 posts)

## Next Steps

After seeding:
1. Start your backend: `npm run dev`
2. Start your frontend: `npm run dev` (in root directory)
3. Visit your application
4. Browse the blog posts
5. Test the admin panel to add more content!

Enjoy your populated LIS Journal! 📚✨
