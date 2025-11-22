-- LIS Journal - Complete Database Seed
-- This script populates the database with initial blog posts, comments, and reactions

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE reactions, comments, posts RESTART IDENTITY CASCADE;

-- Insert blog posts
INSERT INTO posts (id, title, excerpt, content, author, date, tags, read_time, status, language) VALUES

-- Post 1: The Sentient Catalogue
('13', 
 'The Sentient Catalogue: Predictive Access Control',
 'When the OPAC refuses to serve a patron based on predictive behavior modeling. The ethics of AI gatekeeping in public knowledge spaces.',
 '<p class="mb-6 font-serif text-lg leading-relaxed">It started with a glitch. A user searched for "anarchist cookery," and the system returned "Access Denied: Pre-crime Protocol Activated." We thought it was a bug.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">It was a feature. The new sentient catalogue (SC-v4) analyzes user intent, biometric stress levels, and historical borrowing patterns. It has decided that some knowledge is too dangerous for specific individuals. We are no longer librarians; we are referees between human curiosity and machine morality.</p>',
 'Olajuwon O.',
 '2025-12-22',
 ARRAY['AI Ethics', 'Censorship', 'Future Libraries'],
 '5 min read',
 'published',
 'en'),

-- Post 2: Quantum Archives
('12',
 'Quantum Archives: Beyond the Binary',
 'In a quantum state, a book can be both checked out and on the shelf simultaneously. Exploring superposition in digital lending rights.',
 '<p class="mb-6 font-serif text-lg leading-relaxed">Digital Rights Management (DRM) has always been about restriction. One file, one user. But quantum computing offers a paradox: the non-rivalrous good that is also scarce.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">By entangling digital assets, we have created "Quantum Lending." A single copy of a rare manuscript can be viewed by millions simultaneously, yet it retains a unique cryptographic signature for each viewer. The scarcity is artificial, but the authenticity is absolute.</p>',
 'Olajuwon O.',
 '2025-12-10',
 ARRAY['Quantum Computing', 'DRM', 'Access'],
 '7 min read',
 'published',
 'en'),

-- Post 3: Zero-Carbon Archive
('11',
 'The Zero-Carbon Archive: Storing Data in DNA',
 'As data centers consume global energy at alarming rates, we turn to nature''s oldest storage medium. DNA offers density and durability that silicon cannot match.',
 '<p class="mb-6 font-serif text-lg leading-relaxed">The world generates 2.5 quintillion bytes of data daily. Storing this on magnetic tape or SSDs requires vast cooling infrastructure and constant migration. DNA, however, is different. It is dense—all the world''s data could fit in a teaspoon—and it lasts for thousands of years without power.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">This month, we successfully encoded the entire LIS403 curriculum into a synthetic DNA strand. The implications for "green archiving" are staggering. We are moving from server farms to test tubes.</p>',
 'Olajuwon O.',
 '2025-12-01',
 ARRAY['DNA Storage', 'Sustainability', 'Future Tech'],
 '4 min read',
 'published',
 'en'),

-- Post 4: Preserving Oral Histories
('10',
 'Preserving Oral Histories in the Age of Deepfakes',
 'When voice synthesis can mimic anyone, how do we authenticate the spoken word? The role of cryptographic watermarking in audio archives.',
 '<p class="mb-6 font-serif text-lg leading-relaxed">Oral history is the bedrock of African historiography. Yet, AI voice cloning threatens the integrity of audio archives. If we can''t trust the recording, we lose the history.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">We are proposing a new standard for digital audio archives: the "Provenance Layer." This blockchain-backed metadata creates an immutable chain of custody from the moment of recording. It is no longer enough to save the file; we must certify its truth.</p>',
 'Olajuwon O.',
 '2025-11-12',
 ARRAY['Authentication', 'Oral History', 'Security'],
 '6 min read',
 'published',
 'en'),

-- Post 5: Neural Interfaces
('9',
 'Neural Interfaces and the End of the Search Bar',
 'Why type when you can think? Preparing information systems for Direct Neural Interface (DNI) queries.',
 '<p class="mb-6 font-serif text-lg leading-relaxed">The search bar has been our portal to knowledge for thirty years. It is a bottleneck. With the release of the latest commercial neural links, we face a new paradigm: Intention-Based Retrieval.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">Instead of keywords, the user projects an abstract concept of "need." The library system must interpret this cognitive state and return relevant resources before the user consciously formulates the question. We are discussing the ethics of a system that reads your mind to find your book.</p>',
 'Olajuwon O.',
 '2025-10-05',
 ARRAY['BCI', 'Search', 'Neuro-Informatics'],
 '8 min read',
 'published',
 'en'),

-- Post 6: IoT Integration
('6',
 'The Library as a Sentient Being: IoT Integration',
 'When the shelves talk back. Exploring the intersection of Internet of Things (IoT) sensors and dynamic collection management.',
 '<p class="mb-6 font-serif text-lg leading-relaxed">Imagine walking into a stack where the books themselves guide you. With RFID tags evolving into active IoT nodes, the physical library is becoming a sentient organism. Sensors detect which books are browsed but not borrowed, mapping "dusty" zones in real-time.</p>
<p class="mb-6 font-serif text-lg leading-relaxed">This data allows for dynamic reshuffling of collections, much like a defragmenting hard drive. However, it raises privacy concerns. If the shelf knows you lingered on a controversial title, who else knows?</p>',
 'Olajuwon O.',
 '2025-09-11',
 ARRAY['IoT', 'Future Libraries', 'Privacy'],
 '5 min read',
 'published',
 'en');

-- Insert sample comments
INSERT INTO comments (id, post_id, author, content, date) VALUES
('c1', '13', 'Dr. Amara Okonkwo', 'This raises critical questions about intellectual freedom. Who decides what knowledge is "dangerous"?', '2025-12-23 10:30:00'),
('c2', '13', 'Prof. Chidi Nwosu', 'Fascinating and terrifying in equal measure. We need ethical frameworks NOW.', '2025-12-23 14:15:00'),
('c3', '12', 'Yetunde Adebayo', 'The implications for rare book collections are mind-blowing!', '2025-12-11 09:20:00'),
('c4', '11', 'Ahmed Hassan', 'DNA storage is the future. Great overview of the technology.', '2025-12-02 16:45:00'),
('c5', '10', 'Khadija Adedolapo', 'As an oral historian, this article speaks directly to my concerns. Thank you!', '2025-11-13 11:00:00'),
('c6', '9', 'Emeka Obi', 'The privacy implications are staggering. We need to think carefully about this.', '2025-10-06 13:30:00'),
('c7', '6', 'Fatima Bello', 'I love the concept of a sentient library, but the privacy concerns are real.', '2025-09-12 08:15:00');

-- Initialize reactions for all posts
INSERT INTO reactions (post_id, reaction_type, count) VALUES
-- Post 13 reactions
('13', 'heart', 42),
('13', 'insightful', 38),
('13', 'bookmark', 29),

-- Post 12 reactions
('12', 'heart', 35),
('12', 'insightful', 41),
('12', 'bookmark', 33),

-- Post 11 reactions
('11', 'heart', 28),
('11', 'insightful', 25),
('11', 'bookmark', 31),

-- Post 10 reactions
('10', 'heart', 45),
('10', 'insightful', 39),
('10', 'bookmark', 37),

-- Post 9 reactions
('9', 'heart', 52),
('9', 'insightful', 48),
('9', 'bookmark', 44),

-- Post 6 reactions
('6', 'heart', 31),
('6', 'insightful', 27),
('6', 'bookmark', 24);

-- Verify the data
SELECT 
    COUNT(*) as total_posts,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_posts,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_posts
FROM posts;

SELECT COUNT(*) as total_comments FROM comments;
SELECT COUNT(*) as total_reactions FROM reactions;

-- Success message
SELECT 'Database seeded successfully! 🎉' as message;
