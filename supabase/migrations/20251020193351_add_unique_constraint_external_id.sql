/*
  # Add unique constraint to external_id

  1. Changes
    - Add unique constraint to external_id column in matches table
    - This allows upsert operations based on external_id
  
  2. Security
    - No RLS changes needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'matches_external_id_key'
  ) THEN
    ALTER TABLE matches ADD CONSTRAINT matches_external_id_key UNIQUE (external_id);
  END IF;
END $$;