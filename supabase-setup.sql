-- ============================================
-- DIASPORA CONNECT PARIS - Database Schema
-- ============================================
-- This script creates the database schema for the registration form
-- To use: Copy this content and run it in Supabase SQL Editor

-- Create the inscriptions table
CREATE TABLE IF NOT EXISTS inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Section A: Personal Information (Required)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_code TEXT NOT NULL DEFAULT '+33',
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,

  -- Section B: Accommodation (Optional)
  needs_accommodation BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,

  -- Section C: Family (Optional)
  has_children BOOLEAN DEFAULT false,
  number_of_children INTEGER,
  children_ages TEXT,

  -- Section D: Accessibility (Optional)
  has_reduced_mobility BOOLEAN DEFAULT false,
  has_special_needs BOOLEAN DEFAULT false,

  -- Section E: Dietary (Optional)
  allergies TEXT,

  -- Section F: Comments (Optional)
  comments TEXT,

  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),

  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (length(phone) >= 6),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON inscriptions(email);
CREATE INDEX IF NOT EXISTS idx_inscriptions_created_at ON inscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inscriptions_status ON inscriptions(status);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_inscriptions_updated_at ON inscriptions;
CREATE TRIGGER update_inscriptions_updated_at
  BEFORE UPDATE ON inscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy 1: Allow anyone to insert (public registration)
CREATE POLICY "Allow public insert" ON inscriptions
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow authenticated users to view all records
-- (You'll need to modify this based on your authentication setup)
CREATE POLICY "Allow authenticated select" ON inscriptions
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy 3: Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON inscriptions
  FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Create a view for basic statistics (optional but useful)
CREATE OR REPLACE VIEW inscription_stats AS
SELECT
  COUNT(*) as total_inscriptions,
  COUNT(*) FILTER (WHERE needs_accommodation = true) as needs_accommodation_count,
  COUNT(*) FILTER (WHERE has_children = true) as with_children_count,
  COUNT(*) FILTER (WHERE has_reduced_mobility = true) as reduced_mobility_count,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count
FROM inscriptions;

-- Grant access to the view
GRANT SELECT ON inscription_stats TO authenticated;

-- ============================================
-- OPTIONAL: Sample data for testing
-- ============================================
-- Uncomment the following lines if you want to insert test data

/*
INSERT INTO inscriptions (
  full_name, email, phone_code, phone, country, city,
  needs_accommodation, start_date, end_date,
  has_children, number_of_children, children_ages,
  comments, status
) VALUES (
  'Test User',
  'test@example.com',
  '+33',
  '612345678',
  'France',
  'Paris',
  true,
  '2024-01-15',
  '2024-01-20',
  true,
  2,
  '5, 8',
  'This is a test registration',
  'confirmed'
);
*/

-- ============================================
-- NOTES:
-- ============================================
-- 1. Run this script in your Supabase project SQL Editor
-- 2. Make sure to note your Supabase URL and anon key
-- 3. The table is set up with RLS for security
-- 4. Public users can INSERT (register)
-- 5. Only authenticated users can SELECT/UPDATE
