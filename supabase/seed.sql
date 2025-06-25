-- Seed data for Usefully app
-- Run this in your Supabase SQL Editor

-- Insert sample users
INSERT INTO users (id, email, name, bio, useful_score) VALUES
  ('demo-user-1', 'demo@usefully.com', 'Demo User', 'Building useful tools and sharing knowledge', 5),
  ('demo-user-2', 'designer@usefully.com', 'Design Pro', 'UI/UX designer passionate about great user experiences', 8),
  ('demo-user-3', 'backend@usefully.com', 'Backend Dev', 'Full-stack developer focused on scalable solutions', 15)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  useful_score = EXCLUDED.useful_score;

-- Insert sample assets
INSERT INTO assets (id, owner_id, url, title, why_useful, tag, image_url) VALUES
  ('asset-1', 'demo-user-1', 'https://github.com/vercel/next.js', 'Next.js - The React Framework', 'Essential framework for building modern React applications with server-side rendering and static generation.', 'Development', 'https://nextjs.org/static/twitter-image.png'),
  ('asset-2', 'demo-user-2', 'https://tailwindcss.com', 'Tailwind CSS - Utility-First CSS Framework', 'Rapidly build modern websites without ever leaving your HTML. Highly customizable and responsive.', 'Design', 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg'),
  ('asset-3', 'demo-user-3', 'https://supabase.com', 'Supabase - Open Source Firebase Alternative', 'Complete backend solution with database, auth, and real-time subscriptions. Perfect for rapid development.', 'Backend', 'https://supabase.com/images/brand-assets/supabase-logo-wordmark--dark.svg'),
  ('asset-4', 'demo-user-1', 'https://typescriptlang.org', 'TypeScript - JavaScript with syntax for types', 'Adds static typing to JavaScript, making code more reliable and easier to maintain.', 'Development', 'https://www.typescriptlang.org/images/branding/logo.svg'),
  ('asset-5', 'demo-user-2', 'https://figma.com', 'Figma - Collaborative interface design tool', 'Real-time collaborative design tool that makes it easy to create, share, and iterate on designs.', 'Design', 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  why_useful = EXCLUDED.why_useful,
  tag = EXCLUDED.tag,
  image_url = EXCLUDED.image_url;

-- Insert sample useful votes
INSERT INTO useful_votes (user_id, asset_id) VALUES
  ('demo-user-1', 'asset-2'),
  ('demo-user-1', 'asset-3'),
  ('demo-user-2', 'asset-1'),
  ('demo-user-2', 'asset-3'),
  ('demo-user-3', 'asset-1'),
  ('demo-user-3', 'asset-2'),
  ('demo-user-3', 'asset-4'),
  ('demo-user-1', 'asset-5'),
  ('demo-user-2', 'asset-4')
ON CONFLICT (user_id, asset_id) DO NOTHING;

-- Display results
SELECT 'Seeding completed!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_assets FROM assets;
SELECT COUNT(*) as total_votes FROM useful_votes; 