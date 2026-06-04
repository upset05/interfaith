-- IPPAD INTERFAITH FORUM - SUPABASE DATABASE INITIALIZATION SCHEMA
-- Paste this script directly inside Supabase SQL Editor and click "Run"

-- 1. Create News/Announcements Table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL
);

-- 2. Create Featured Event Heroes Table
CREATE TABLE IF NOT EXISTS event_heroes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL
);

-- 3. Create Main Gallery Photos Table
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url TEXT NOT NULL
);

-- 4. Create Video Library Table
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  embed_url TEXT NOT NULL
);

-- 5. Create Homepage Hero Layout Table
CREATE TABLE IF NOT EXISTS hero_content (
  id TEXT PRIMARY KEY DEFAULT 'main_hero',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  motto TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT NOT NULL
);

-- 6. Enable Row Level Security (RLS) on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- 7. Grant Public Read/Write Access Policies (Anon access for ease of deployment)
-- Posts Policies
DROP POLICY IF EXISTS "Allow public select on posts" ON posts;
DROP POLICY IF EXISTS "Allow anon insert on posts" ON posts;
DROP POLICY IF EXISTS "Allow anon update on posts" ON posts;
DROP POLICY IF EXISTS "Allow anon delete on posts" ON posts;
CREATE POLICY "Allow public select on posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on posts" ON posts FOR DELETE USING (true);

-- Event Heroes Policies
DROP POLICY IF EXISTS "Allow public select on event_heroes" ON event_heroes;
DROP POLICY IF EXISTS "Allow anon insert on event_heroes" ON event_heroes;
DROP POLICY IF EXISTS "Allow anon update on event_heroes" ON event_heroes;
DROP POLICY IF EXISTS "Allow anon delete on event_heroes" ON event_heroes;
CREATE POLICY "Allow public select on event_heroes" ON event_heroes FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on event_heroes" ON event_heroes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on event_heroes" ON event_heroes FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on event_heroes" ON event_heroes FOR DELETE USING (true);

-- Gallery Policies
DROP POLICY IF EXISTS "Allow public select on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow anon insert on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow anon update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow anon delete on gallery" ON gallery;
CREATE POLICY "Allow public select on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on gallery" ON gallery FOR DELETE USING (true);

-- Videos Policies
DROP POLICY IF EXISTS "Allow public select on videos" ON videos;
DROP POLICY IF EXISTS "Allow anon insert on videos" ON videos;
DROP POLICY IF EXISTS "Allow anon update on videos" ON videos;
DROP POLICY IF EXISTS "Allow anon delete on videos" ON videos;
CREATE POLICY "Allow public select on videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on videos" ON videos FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on videos" ON videos FOR DELETE USING (true);

-- Hero Content Policies
DROP POLICY IF EXISTS "Allow public select on hero_content" ON hero_content;
DROP POLICY IF EXISTS "Allow anon insert on hero_content" ON hero_content;
DROP POLICY IF EXISTS "Allow anon update on hero_content" ON hero_content;
DROP POLICY IF EXISTS "Allow anon delete on hero_content" ON hero_content;
CREATE POLICY "Allow public select on hero_content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on hero_content" ON hero_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on hero_content" ON hero_content FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on hero_content" ON hero_content FOR DELETE USING (true);

-- 8. Seed initial default values for Homepage Hero content
INSERT INTO hero_content (id, badge, title, motto, description, photo_url)
VALUES (
  'main_hero', 
  'Different Faiths, One Humanity', 
  'Imams & Pastors<br/><em>Interfaith Forum</em>', 
  'IPPAD — Different Faiths, One Humanity', 
  'Empowering local community champions through interfaith cooperation and agricultural development in Nigeria.', 
  'WhatsApp Image 2026-05-01 at 5.53.05 PM.jpeg'
)
ON CONFLICT (id) DO UPDATE SET
  badge = EXCLUDED.badge,
  title = EXCLUDED.title,
  motto = EXCLUDED.motto,
  description = EXCLUDED.description,
  photo_url = EXCLUDED.photo_url;

-- 9. Create Contact Requests / Messages Table
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  organisation TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL
);

-- 10. Create Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- 11. Enable Row Level Security on new tables
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 12. Policies for Requests Table (Allow public anon inserts, reads, updates, and deletes)
DROP POLICY IF EXISTS "Allow public select on requests" ON requests;
DROP POLICY IF EXISTS "Allow anon insert on requests" ON requests;
DROP POLICY IF EXISTS "Allow anon update on requests" ON requests;
DROP POLICY IF EXISTS "Allow anon delete on requests" ON requests;
CREATE POLICY "Allow public select on requests" ON requests FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on requests" ON requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on requests" ON requests FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on requests" ON requests FOR DELETE USING (true);

-- 13. Policies for Subscriptions Table (Allow public anon inserts, reads, and deletes)
DROP POLICY IF EXISTS "Allow public select on subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow anon insert on subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow anon delete on subscriptions" ON subscriptions;
CREATE POLICY "Allow public select on subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on subscriptions" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete on subscriptions" ON subscriptions FOR DELETE USING (true);
