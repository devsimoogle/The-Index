# Database Migration Script
# Run this to seed initial data into PostgreSQL

INSERT INTO posts (id, title, excerpt, content, author, date, tags, read_time, status, language) VALUES
('1', 'The Evolution of Digital Libraries', 'Exploring how digital libraries have transformed information access in the 21st century.', 
'<p>Digital libraries have revolutionized the way we access and preserve information...</p>', 
'Dr. Amara Okonkwo', '2025-01-15', ARRAY['Digital Libraries', 'Technology', 'Access'], '8 min read', 'published', 'en'),

('2', 'Cataloging in the Age of AI', 'How artificial intelligence is reshaping traditional cataloging practices.',
'<p>The integration of AI into library cataloging systems represents a paradigm shift...</p>',
'Prof. Chidi Nwosu', '2025-01-10', ARRAY['AI', 'Cataloging', 'Innovation'], '6 min read', 'published', 'en'),

('3', 'Preserving Indigenous Knowledge', 'Strategies for archiving and protecting indigenous knowledge systems.',
'<p>Indigenous knowledge systems contain invaluable wisdom that must be preserved...</p>',
'Dr. Yetunde Adebayo', '2025-01-05', ARRAY['Preservation', 'Indigenous Knowledge', 'Archives'], '10 min read', 'published', 'en');

-- Added some sample comments you, can remove if not necessary.
INSERT INTO comments (id, post_id, author, content, date) VALUES
('c1', '1', 'Kehfad', 'Excellent article! Very insightful.', NOW()),
('c2', '1', 'Jane Smith', 'This really helped me understand digital libraries better.', NOW()),
('c3', '2', 'Ahmed Hassan', 'AI in cataloging is the future!', NOW());
-- ('c4', '2','Khadija Adedolapo', 'I love the asthetics of the the the Index Journal', NOW());

-- Initialize reactions
INSERT INTO reactions (post_id, reaction_type, count) VALUES
('1', 'heart', 15),
('1', 'insightful', 8),
('1', 'bookmark', 12),
('2', 'heart', 10),
('2', 'insightful', 14),
('2', 'bookmark', 7),
('3', 'heart', 20),
('3', 'insightful', 18),
('3', 'bookmark', 15);
