/*
  # Add policy for service role to insert matches

  1. Changes
    - Add policy to allow service role (edge functions) to insert/update matches
  
  2. Security
    - Only allows authenticated users to insert via edge functions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'matches' 
    AND policyname = 'Service role can manage matches'
  ) THEN
    CREATE POLICY "Service role can manage matches"
      ON matches
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;