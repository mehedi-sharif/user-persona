-- Add new columns to customers table for enhanced persona data
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

-- Rename 'name' to keep backward compatibility but prefer 'full_name'
-- We'll keep both for now and migrate data
UPDATE customers SET full_name = name WHERE full_name IS NULL;

-- Create index for faster lookups by API user ID
CREATE INDEX IF NOT EXISTS idx_customers_api_user_id ON customers(api_user_id);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Add trigger to automatically update updated_at timestamp
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

-- Add comment to table
COMMENT ON TABLE customers IS 'User persona data with flexible schema for adding more fields';
