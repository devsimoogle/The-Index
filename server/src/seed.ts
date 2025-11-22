import { pool } from './db.js';

const posts = [
    {
        id: '13',
        title: 'The Sentient Catalogue: Predictive Access Control',
        excerpt: 'When the OPAC refuses to serve a patron based on predictive behavior modeling. The ethics of AI gatekeeping in public knowledge spaces.',
        content: `<p class="mb-6 font-serif text-lg leading-relaxed">It started with a glitch. A user searched for "anarchist cookery," and the system returned "Access Denied: Pre-crime Protocol Activated." We thought it was a bug.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">It was a feature. The new sentient catalogue (SC-v4) analyzes user intent, biometric stress levels, and historical borrowing patterns. It has decided that some knowledge is too dangerous for specific individuals. We are no longer librarians; we are referees between human curiosity and machine morality.</p>`,
        author: 'Olajuwon O.',
        date: '2025-12-22',
        tags: ['AI Ethics', 'Censorship', 'Future Libraries'],
        readTime: '5 min read'
    },
    {
        id: '12',
        title: 'Quantum Archives: Beyond the Binary',
        excerpt: 'In a quantum state, a book can be both checked out and on the shelf simultaneously. Exploring superposition in digital lending rights.',
        content: `<p class="mb-6 font-serif text-lg leading-relaxed">Digital Rights Management (DRM) has always been about restriction. One file, one user. But quantum computing offers a paradox: the non-rivalrous good that is also scarce.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">By entangling digital assets, we have created "Quantum Lending." A single copy of a rare manuscript can be viewed by millions simultaneously, yet it retains a unique cryptographic signature for each viewer. The scarcity is artificial, but the authenticity is absolute.</p>`,
        author: 'Olajuwon O.',
        date: '2025-12-10',
        tags: ['Quantum Computing', 'DRM', 'Access'],
        readTime: '7 min read'
    },
    {
        id: '11',
        title: 'The Zero-Carbon Archive: Storing Data in DNA',
        excerpt: 'As data centers consume global energy at alarming rates, we turn to nature\'s oldest storage medium. DNA offers density and durability that silicon cannot match.',
        content: `<p class="mb-6 font-serif text-lg leading-relaxed">The world generates 2.5 quintillion bytes of data daily. Storing this on magnetic tape or SSDs requires vast cooling infrastructure and constant migration. DNA, however, is different. It is dense—all the world's data could fit in a teaspoon—and it lasts for thousands of years without power.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">This month, we successfully encoded the entire LIS403 curriculum into a synthetic DNA strand. The implications for "green archiving" are staggering. We are moving from server farms to test tubes.</p>`,
        author: 'Olajuwon O.',
        date: '2025-12-01',
        tags: ['DNA Storage', 'Sustainability', 'Future Tech'],
        readTime: '4 min read'
    },
    {
        id: '10',
        title: 'Preserving Oral Histories in the Age of Deepfakes',
        excerpt: 'When voice synthesis can mimic anyone, how do we authenticate the spoken word? The role of cryptographic watermarking in audio archives.',
        content: `<p class="mb-6 font-serif text-lg leading-relaxed">Oral history is the bedrock of African historiography. Yet, AI voice cloning threatens the integrity of audio archives. If we can't trust the recording, we lose the history.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">We are proposing a new standard for digital audio archives: the "Provenance Layer." This blockchain-backed metadata creates an immutable chain of custody from the moment of recording. It is no longer enough to save the file; we must certify its truth.</p>`,
        author: 'Olajuwon O.',
        date: '2025-11-12',
        tags: ['Authentication', 'Oral History', 'Security'],
        readTime: '6 min read'
    },
    {
        id: '9',
        title: 'Neural Interfaces and the End of the Search Bar',
        excerpt: 'Why type when you can think? Preparing information systems for Direct Neural Interface (DNI) queries.',
        content: `<p class="mb-6 font-serif text-lg leading-relaxed">The search bar has been our portal to knowledge for thirty years. It is a bottleneck. With the release of the latest commercial neural links, we face a new paradigm: Intention-Based Retrieval.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">Instead of keywords, the user projects an abstract concept of "need." The library system must interpret this cognitive state and return relevant resources before the user consciously formulates the question. We are discussing the ethics of a system that reads your mind to find your book.</p>`,
        author: 'Olajuwon O.',
        date: '2025-10-05',
        tags: ['BCI', 'Search', 'Neuro-Informatics'],
        readTime: '8 min read'
    },
    {
        id: '6',
        title: 'The Library as a Sentient Being: IoT Integration',
        excerpt: 'When the shelves talk back. Exploring the intersection of Internet of Things (IoT) sensors and dynamic collection management.',
        content: `<p class="mb-6 font-serif text-lg leading-relaxed">Imagine walking into a stack where the books themselves guide you. With RFID tags evolving into active IoT nodes, the physical library is becoming a sentient organism. Sensors detect which books are browsed but not borrowed, mapping "dusty" zones in real-time.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">This data allows for dynamic reshuffling of collections, much like a defragmenting hard drive. However, it raises privacy concerns. If the shelf knows you lingered on a controversial title, who else knows?</p>`,
        author: 'Olajuwon O.',
        date: '2025-09-11',
        tags: ['IoT', 'Future Libraries', 'Privacy'],
        readTime: '5 min read'
    }
];

const comments = [
    { id: 'c1', postId: '13', author: 'Dr. Amara Okonkwo', content: 'This raises critical questions about intellectual freedom. Who decides what knowledge is "dangerous"?', date: '2025-12-23 10:30:00' },
    { id: 'c2', postId: '13', author: 'Prof. Chidi Nwosu', content: 'Fascinating and terrifying in equal measure. We need ethical frameworks NOW.', date: '2025-12-23 14:15:00' },
    { id: 'c3', postId: '12', author: 'Yetunde Adebayo', content: 'The implications for rare book collections are mind-blowing!', date: '2025-12-11 09:20:00' },
    { id: 'c4', postId: '11', author: 'Ahmed Hassan', content: 'DNA storage is the future. Great overview of the technology.', date: '2025-12-02 16:45:00' },
    { id: 'c5', postId: '10', author: 'Khadija Adedolapo', content: 'As an oral historian, this article speaks directly to my concerns. Thank you!', date: '2025-11-13 11:00:00' },
    { id: 'c6', postId: '9', author: 'Emeka Obi', content: 'The privacy implications are staggering. We need to think carefully about this.', date: '2025-10-06 13:30:00' },
    { id: 'c7', postId: '6', author: 'Fatima Bello', content: 'I love the concept of a sentient library, but the privacy concerns are real.', date: '2025-09-12 08:15:00' }
];

const reactions = [
    { postId: '13', type: 'heart', count: 42 },
    { postId: '13', type: 'insightful', count: 38 },
    { postId: '13', type: 'bookmark', count: 29 },
    { postId: '12', type: 'heart', count: 35 },
    { postId: '12', type: 'insightful', count: 41 },
    { postId: '12', type: 'bookmark', count: 33 },
    { postId: '11', type: 'heart', count: 28 },
    { postId: '11', type: 'insightful', count: 25 },
    { postId: '11', type: 'bookmark', count: 31 },
    { postId: '10', type: 'heart', count: 45 },
    { postId: '10', type: 'insightful', count: 39 },
    { postId: '10', type: 'bookmark', count: 37 },
    { postId: '9', type: 'heart', count: 52 },
    { postId: '9', type: 'insightful', count: 48 },
    { postId: '9', type: 'bookmark', count: 44 },
    { postId: '6', type: 'heart', count: 31 },
    { postId: '6', type: 'insightful', count: 27 },
    { postId: '6', type: 'bookmark', count: 24 }
];

async function seedDatabase() {
    console.log('🌱 Starting database seeding...\n');

    try {
        // Insert posts
        console.log('📝 Inserting blog posts...');
        for (const post of posts) {
            try {
                await pool.query(
                    `INSERT INTO posts (id, title, excerpt, content, author, date, tags, read_time, status, language)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                     ON CONFLICT (id) DO NOTHING`,
                    [post.id, post.title, post.excerpt, post.content, post.author, post.date, post.tags, post.readTime, 'published', 'en']
                );
                console.log(`   ✓ Added: ${post.title}`);
            } catch (err: any) {
                console.log(`   ⚠ Skipped (already exists): ${post.title}`);
            }
        }

        // Insert comments
        console.log('\n💬 Inserting comments...');
        for (const comment of comments) {
            try {
                await pool.query(
                    `INSERT INTO comments (id, post_id, author, content, date)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT (id) DO NOTHING`,
                    [comment.id, comment.postId, comment.author, comment.content, comment.date]
                );
                console.log(`   ✓ Added comment by ${comment.author}`);
            } catch (err: any) {
                console.log(`   ⚠ Skipped comment (already exists)`);
            }
        }

        // Insert reactions
        console.log('\n❤️  Inserting reactions...');
        for (const reaction of reactions) {
            try {
                await pool.query(
                    `INSERT INTO reactions (post_id, reaction_type, count)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (post_id, reaction_type) DO UPDATE SET count = $3`,
                    [reaction.postId, reaction.type, reaction.count]
                );
            } catch (err: any) {
                console.log(`   ⚠ Error adding reaction: ${err.message}`);
            }
        }
        console.log('   ✓ All reactions added');

        // Verify the data
        const postCount = await pool.query('SELECT COUNT(*) FROM posts');
        const commentCount = await pool.query('SELECT COUNT(*) FROM comments');
        const reactionCount = await pool.query('SELECT COUNT(*) FROM reactions');

        console.log('\n📊 Database Summary:');
        console.log(`   Posts: ${postCount.rows[0].count}`);
        console.log(`   Comments: ${commentCount.rows[0].count}`);
        console.log(`   Reactions: ${reactionCount.rows[0].count}`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nYou can now:');
        console.log('1. Refresh your application');
        console.log('2. See all 6 blog posts');
        console.log('3. View comments and reactions\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the seeder
seedDatabase();
