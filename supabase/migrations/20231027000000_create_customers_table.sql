CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  job_title TEXT,
  raw_notes TEXT,
  pain_points TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  persona_summary TEXT,
  last_researched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access (since this is an internal tool demo)
-- In a real app, you would restrict this to authenticated users.
CREATE POLICY "Allow all access" ON customers FOR ALL USING (true);
