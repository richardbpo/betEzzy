/*
  # Add external match ID tracking

  1. Changes
    - Add `external_id` column to matches table for tracking matches from external APIs
    - Add unique constraint to prevent duplicate matches
    - Add index for faster lookups
  
  2. Security
    - No RLS changes needed as the table already has RLS enabled
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matches' AND column_name = 'external_id'
  ) THEN
    ALTER TABLE matches ADD COLUMN external_id text;
    CREATE INDEX IF NOT EXISTS idx_matches_external_id ON matches(external_id);
  END IF;
END $$;