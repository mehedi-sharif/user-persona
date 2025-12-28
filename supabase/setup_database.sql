-- ============================================
-- COMPLETE DATABASE SETUP FOR USER PERSONA
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Create the customers table
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

-- Step 2: Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow all access (internal tool)
CREATE POLICY "Allow all access" ON customers FOR ALL USING (true);

-- Step 4: Add new columns for enhanced persona data
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS api_user_id TEXT UNIQUE, -- Reference to API user ID
  ADD COLUMN IF NOT EXISTS full_name TEXT, -- Full name from API
  ADD COLUMN IF NOT EXISTS image TEXT, -- Profile image URL
  ADD COLUMN IF NOT EXISTS country TEXT, -- User's country
  ADD COLUMN IF NOT EXISTS linkedin_profile TEXT, -- LinkedIn profile URL
  ADD COLUMN IF NOT EXISTS company TEXT, -- Company name
  ADD COLUMN IF NOT EXISTS industry TEXT, -- Industry
  ADD COLUMN IF NOT EXISTS phone TEXT, -- Phone number
  ADD COLUMN IF NOT EXISTS website TEXT, -- Personal or company website
  ADD COLUMN IF NOT EXISTS bio TEXT, -- Short bio
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 5: Migrate existing data
UPDATE customers SET full_name = name WHERE full_name IS NULL;

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_api_user_id ON customers(api_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Step 7: Add auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Add table comment
COMMENT ON TABLE customers IS 'User persona data with flexible schema for adding more fields';

-- ============================================
-- SETUP COMPLETE! 
-- Your customers table is ready to use.
-- ============================================
