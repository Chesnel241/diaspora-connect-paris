-- ============================================
-- MIGRATION SCRIPT - Add Security Constraints
-- ============================================
-- This script adds new security constraints to existing inscriptions table
-- Run this in Supabase SQL Editor if you already have the table created
-- This will NOT delete your existing data

-- Step 1: Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow public insert" ON inscriptions;
DROP POLICY IF EXISTS "Allow authenticated select" ON inscriptions;
DROP POLICY IF EXISTS "Allow authenticated update" ON inscriptions;

-- Step 2: Add new constraints (they will be ignored if they already exist)
DO $$
BEGIN
  -- Add email length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_email_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_email_length CHECK (length(email) <= 254);
  END IF;

  -- Add phone format constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_phone_format'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_phone_format CHECK (phone ~* '^[0-9\s\-\+\(\)]+$');
  END IF;

  -- Update phone constraint (drop old one and add new)
  BEGIN
    ALTER TABLE inscriptions DROP CONSTRAINT IF EXISTS valid_phone;
    ALTER TABLE inscriptions ADD CONSTRAINT valid_phone CHECK (length(phone) >= 6 AND length(phone) <= 20);
  EXCEPTION WHEN OTHERS THEN
    -- Constraint might not exist, continue
  END;

  -- Add full_name length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_full_name_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_full_name_length CHECK (length(full_name) > 0 AND length(full_name) <= 100);
  END IF;

  -- Add country length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_country_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_country_length CHECK (length(country) > 0 AND length(country) <= 100);
  END IF;

  -- Add city length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_city_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_city_length CHECK (length(city) > 0 AND length(city) <= 100);
  END IF;

  -- Add children count constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_children_count'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_children_count CHECK (number_of_children IS NULL OR (number_of_children >= 0 AND number_of_children <= 20));
  END IF;

  -- Add children ages length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_children_ages_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_children_ages_length CHECK (children_ages IS NULL OR length(children_ages) <= 100);
  END IF;

  -- Add allergies length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_allergies_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_allergies_length CHECK (allergies IS NULL OR length(allergies) <= 500);
  END IF;

  -- Add comments length constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_comments_length'
  ) THEN
    ALTER TABLE inscriptions ADD CONSTRAINT valid_comments_length CHECK (comments IS NULL OR length(comments) <= 1000);
  END IF;

END $$;

-- Step 3: Drop old email index and create unique one
DROP INDEX IF EXISTS idx_inscriptions_email;
CREATE UNIQUE INDEX IF NOT EXISTS idx_inscriptions_email_unique ON inscriptions(LOWER(email));

-- Step 4: Add phone index
CREATE INDEX IF NOT EXISTS idx_inscriptions_phone ON inscriptions(phone_code, phone);

-- Step 5: Recreate policies with the new definitions
CREATE POLICY "Allow public insert" ON inscriptions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select" ON inscriptions
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow authenticated update" ON inscriptions
  FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! New security constraints added.';
END $$;
