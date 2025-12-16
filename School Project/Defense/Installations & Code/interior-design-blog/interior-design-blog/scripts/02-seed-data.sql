-- Seed data for Interior Design Blog

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Living Room', 'living-room', 'Comfortable and stylish living spaces'),
('Kitchen', 'kitchen', 'Modern and functional kitchen designs'),
('Bedroom', 'bedroom', 'Peaceful and cozy bedroom retreats'),
('Bathroom', 'bathroom', 'Luxurious and spa-like bathroom designs'),
('Outdoor', 'outdoor', 'Beautiful outdoor living spaces'),
('Office', 'office', 'Productive and inspiring home offices'),
('Dining Room', 'dining-room', 'Elegant dining and entertaining spaces'),
('Entryway', 'entryway', 'Welcoming and functional entry spaces');

-- Insert authors
INSERT INTO authors (name, email, bio, avatar_url) VALUES
('Emma Nielsen', 'emma@designhub.com', 'Scandinavian design expert with 10+ years of experience in minimalist interiors.', '/placeholder.svg?height=100&width=100'),
('Marcus Chen', 'marcus@designhub.com', 'Kitchen design specialist known for bold transformations and innovative storage solutions.', '/placeholder.svg?height=100&width=100'),
('Sofia Rodriguez', 'sofia@designhub.com', 'Bedroom and wellness space designer focused on creating restful environments.', '/placeholder.svg?height=100&width=100');

-- Insert sample posts
INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, author_id, read_time, is_featured, status, published_at) VALUES
(
  'Scandinavian Minimalism: Creating Serene Spaces',
  'scandinavian-minimalism-creating-serene-spaces',
  'Discover how to achieve the perfect balance of functionality and beauty with clean lines, natural materials, and thoughtful design choices.',
  '<h2>The Art of Scandinavian Design</h2><p>Scandinavian design has captivated homeowners worldwide with its emphasis on simplicity, functionality, and natural beauty. This design philosophy, rooted in the Nordic countries, creates spaces that feel both serene and purposeful.</p><h3>Key Elements</h3><ul><li>Clean, uncluttered lines</li><li>Natural materials like wood and stone</li><li>Neutral color palettes</li><li>Abundant natural light</li><li>Functional furniture with timeless appeal</li></ul><p>To achieve this look in your own home, start with a neutral base and add warmth through natural textures and carefully chosen accessories.</p>',
  '/modern-scandinavian-living-room-with-white-walls-n.jpg',
  1, 1, 5, TRUE, 'published', '2024-12-08 10:00:00'
),
(
  'Bold Kitchen Transformations That Inspire',
  'bold-kitchen-transformations-that-inspire',
  'From statement backsplashes to dramatic color schemes, explore kitchen designs that make a lasting impression.',
  '<h2>Making a Statement in the Kitchen</h2><p>The kitchen is the heart of the home, and bold design choices can transform it into a space that truly reflects your personality. Whether through color, texture, or innovative layouts, these transformations show how to create kitchens that inspire daily.</p><h3>Design Strategies</h3><ul><li>Statement backsplashes with geometric patterns</li><li>Bold cabinet colors like deep greens or navy blues</li><li>Mixed materials for visual interest</li><li>Strategic lighting to highlight key features</li></ul><p>Remember, bold doesn''t mean overwhelming. The key is to choose one or two statement elements and let them shine.</p>',
  '/modern-kitchen-with-dark-green-cabinets-marble-cou.jpg',
  2, 2, 7, TRUE, 'published', '2024-12-06 14:30:00'
),
(
  'Cozy Bedroom Retreats for Every Season',
  'cozy-bedroom-retreats-for-every-season',
  'Transform your bedroom into a year-round sanctuary with layered textures, warm lighting, and seasonal accents.',
  '<h2>Creating Your Personal Sanctuary</h2><p>Your bedroom should be a retreat from the world—a place where you can truly relax and recharge. By incorporating seasonal elements and focusing on comfort, you can create a space that feels fresh and inviting throughout the year.</p><h3>Seasonal Comfort Tips</h3><ul><li>Layer different textures for visual and tactile interest</li><li>Use warm, dimmable lighting for ambiance</li><li>Incorporate seasonal colors through accessories</li><li>Choose quality bedding that feels luxurious</li></ul><p>The goal is to create a space that feels like a five-star hotel suite—comfortable, elegant, and perfectly tailored to your needs.</p>',
  '/cozy-bedroom-with-warm-lighting-layered-textiles-n.jpg',
  3, 3, 4, TRUE, 'published', '2024-12-04 09:15:00'
);
