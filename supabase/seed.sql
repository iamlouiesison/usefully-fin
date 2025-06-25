-- Seed data for Usefully app
-- Run this in your Supabase SQL Editor

-- Insert sample users with proper UUIDs
INSERT INTO users (id, email, name, bio, useful_score) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'demo@usefully.com', 'Demo User', 'Building useful tools and sharing knowledge', 5),
  ('550e8400-e29b-41d4-a716-446655440002', 'designer@usefully.com', 'Design Pro', 'UI/UX designer passionate about great user experiences', 8),
  ('550e8400-e29b-41d4-a716-446655440003', 'backend@usefully.com', 'Backend Dev', 'Full-stack developer focused on scalable solutions', 15)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  useful_score = EXCLUDED.useful_score;

-- Insert sample assets with proper UUIDs
INSERT INTO assets (id, owner_id, url, title, why_useful, tag, image_url) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'https://github.com/vercel/next.js', 'Next.js - The React Framework', 'Essential framework for building modern React applications with server-side rendering and static generation.', 'Development', 'https://nextjs.org/static/twitter-image.png'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'https://tailwindcss.com', 'Tailwind CSS - Utility-First CSS Framework', 'Rapidly build modern websites without ever leaving your HTML. Highly customizable and responsive.', 'Design', 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'https://supabase.com', 'Supabase - Open Source Firebase Alternative', 'Complete backend solution with database, auth, and real-time subscriptions. Perfect for rapid development.', 'Backend', 'https://supabase.com/images/brand-assets/supabase-logo-wordmark--dark.svg'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'https://typescriptlang.org', 'TypeScript - JavaScript with syntax for types', 'Adds static typing to JavaScript, making code more reliable and easier to maintain.', 'Development', 'https://www.typescriptlang.org/images/branding/logo.svg'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'https://figma.com', 'Figma - Collaborative interface design tool', 'Real-time collaborative design tool that makes it easy to create, share, and iterate on designs.', 'Design', 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  why_useful = EXCLUDED.why_useful,
  tag = EXCLUDED.tag,
  image_url = EXCLUDED.image_url;

-- Insert sample useful votes with proper UUIDs
INSERT INTO useful_votes (user_id, asset_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440005'),
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (user_id, asset_id) DO NOTHING;

-- Display results
SELECT 'Seeding completed!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_assets FROM assets;
SELECT COUNT(*) as total_votes FROM useful_votes; 