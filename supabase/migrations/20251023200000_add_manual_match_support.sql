/*
  # Add Manual Match Support to Predictions

  ## Changes Made

  1. **predictions table updates**
    - Add `home_team` (text) - Store team name for manual matches
    - Add `away_team` (text) - Store team name for manual matches
    - Add `league` (text) - Store league name for manual matches
    - Add `home_odds` (numeric) - Store odds for manual matches
    - Add `draw_odds` (numeric) - Store odds for manual matches
    - Add `away_odds` (numeric) - Store odds for manual matches
    - Add `result_status` (text) - Track if admin has updated result (pending, won, lost)
    - Make `match_id` nullable to support manual matches

  2. **Notes**
    - Manual matches won't have a match_id since they don't exist in matches table
    - All match data will be stored directly in predictions table for manual entries
    - result_status will be updated by admins to mark predictions as won/lost
*/

-- Add columns to predictions table for manual match support
DO $$
BEGIN
  -- Add home_team column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'home_team'
  ) THEN
    ALTER TABLE predictions ADD COLUMN home_team text;
  END IF;

  -- Add away_team column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'away_team'
  ) THEN
    ALTER TABLE predictions ADD COLUMN away_team text;
  END IF;

  -- Add league column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'league'
  ) THEN
    ALTER TABLE predictions ADD COLUMN league text;
  END IF;

  -- Add home_odds column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'home_odds'
  ) THEN
    ALTER TABLE predictions ADD COLUMN home_odds numeric;
  END IF;

  -- Add draw_odds column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'draw_odds'
  ) THEN
    ALTER TABLE predictions ADD COLUMN draw_odds numeric;
  END IF;

  -- Add away_odds column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'away_odds'
  ) THEN
    ALTER TABLE predictions ADD COLUMN away_odds numeric;
  END IF;

  -- Add result_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'result_status'
  ) THEN
    ALTER TABLE predictions ADD COLUMN result_status text DEFAULT 'pending' CHECK (result_status IN ('pending', 'won', 'lost'));
  END IF;
END $$;

-- Make match_id nullable for manual matches
ALTER TABLE predictions ALTER COLUMN match_id DROP NOT NULL;

-- Add policy for admins to update prediction results
CREATE POLICY "Admins can update prediction results"
  ON predictions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));
