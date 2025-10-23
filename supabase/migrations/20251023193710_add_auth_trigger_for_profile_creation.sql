/*
  # Add Automatic Profile Creation on User Signup

  ## Changes
  1. Creates a trigger function that automatically creates a profile when a new user signs up
  2. Creates a trigger that fires after insert on auth.users
  3. Automatically creates welcome tokens for new users

  ## Details
  - Function `handle_new_user()` creates:
    - User profile with default values
    - Welcome token package (10 free tokens, 7 days validity)
  - Trigger fires AFTER INSERT on auth.users
  - Uses security definer to bypass RLS during initial setup
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_token_id uuid;
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    role,
    win_rate,
    total_predictions,
    correct_predictions
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'system_user',
    0,
    0,
    0
  );

  -- Create welcome token package (10 free tokens for 7 days)
  INSERT INTO public.tokens (
    user_id,
    token_type,
    subscription_period,
    amount,
    remaining,
    price_paid,
    status,
    request_date,
    approval_date,
    expiry_date
  ) VALUES (
    NEW.id,
    'standard',
    'weekly',
    10,
    10,
    0,
    'active',
    NOW(),
    NOW(),
    NOW() + INTERVAL '7 days'
  );

  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
