CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS article_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID, topic TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','review','approved','rejected','ready','published','archived')),
  cycle_number INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), session_id UUID REFERENCES article_sessions(id) ON DELETE CASCADE,
  title TEXT, content TEXT, meta_description TEXT, keywords TEXT[], word_count INTEGER, seo_score INTEGER,
  recommended_links TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), session_id UUID REFERENCES article_sessions(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', approval_notes TEXT, rejected_reason TEXT, approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS agent_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), approval_id UUID REFERENCES approvals(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL, confidence_score INTEGER, reasoning TEXT, suggestions TEXT[], created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS link_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), approval_id UUID REFERENCES approvals(id) ON DELETE CASCADE,
  internal_links JSONB DEFAULT '[]', external_links JSONB DEFAULT '[]', overall_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), session_id UUID REFERENCES article_sessions(id) ON DELETE CASCADE,
  agents_to_revise TEXT[], user_feedback TEXT, cycle_number INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS approval_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), session_id UUID REFERENCES article_sessions(id) ON DELETE CASCADE,
  approval_id UUID, action TEXT NOT NULL, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE article_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON article_sessions FOR ALL USING (true);
CREATE POLICY "Allow all" ON drafts FOR ALL USING (true);
CREATE POLICY "Allow all" ON approvals FOR ALL USING (true);
CREATE POLICY "Allow all" ON agent_reports FOR ALL USING (true);
CREATE POLICY "Allow all" ON link_validations FOR ALL USING (true);
CREATE POLICY "Allow all" ON revisions FOR ALL USING (true);
CREATE POLICY "Allow all" ON approval_history FOR ALL USING (true);

-- New Tables for User Auth & Internal Links
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY, -- Maps to auth.users.id
  full_name TEXT,
  whatsapp_number TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internal_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- For multi-tenant isolation
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all" ON internal_links FOR ALL USING (true);
