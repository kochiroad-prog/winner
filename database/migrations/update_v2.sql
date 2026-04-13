-- 1. Update status check to include 'ready'
ALTER TABLE article_sessions DROP CONSTRAINT IF EXISTS article_sessions_status_check;
ALTER TABLE article_sessions ADD CONSTRAINT article_sessions_status_check CHECK (status IN ('pending','processing','review','approved','rejected','ready','published','archived'));

-- 2. Add recommended_links array to drafts
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS recommended_links TEXT[];

-- 3. Create Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY, -- Maps to auth.users.id
  full_name TEXT,
  whatsapp_number TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON profiles;
CREATE POLICY "Allow all" ON profiles FOR ALL USING (true);

-- 4. Create Internal Links Table
CREATE TABLE IF NOT EXISTS internal_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE internal_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON internal_links;
CREATE POLICY "Allow all" ON internal_links FOR ALL USING (true);
