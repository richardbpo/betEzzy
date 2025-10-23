/*
  # Update User Creation Trigger to Use Metadata
  
  ## Changes
  - Updates handle_new_user function to extract phone and country from user metadata
  - Ensures all user data from registration is properly saved
*/

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
    phone,
    country,
    role,
    win_rate,
    total_predictions,
    correct_predictions
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'country', 'Uganda'),
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
