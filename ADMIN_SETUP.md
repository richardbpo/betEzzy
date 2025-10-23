# Admin Account Setup Instructions

## Creating an Admin Account

Since Supabase requires authentication through its system, follow these steps:

### Method 1: Register through the app and upgrade to admin

1. **Register a new account** through the app:
   - Email: `admin@beteasy.com`
   - Password: `Admin123!@#` (or your preferred secure password)
   - Username: `admin`
   - Full Name: `System Administrator`

2. **After registration**, run this SQL query in Supabase SQL Editor to upgrade to admin:

```sql
-- Find the user ID by email
SELECT id, email FROM auth.users WHERE email = 'admin@beteasy.com';

-- Update the profile to system_admin role (replace USER_ID with the actual ID from above)
UPDATE profiles
SET role = 'system_admin'
WHERE id = 'USER_ID_HERE';
```

### Method 2: Quick Setup Script (Run in Supabase SQL Editor)

If you already have a registered account, you can upgrade any existing user to admin:

```sql
-- List all existing users
SELECT p.id, p.username, p.full_name, p.role, au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id;

-- Upgrade specific user to admin (replace with actual user_id or email)
UPDATE profiles
SET role = 'system_admin'
WHERE username = 'Richard';  -- Or use: id = 'user_id_here'
```

### Alternative: Create Admin via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **"Add user"**
4. Enter:
   - Email: `admin@beteasy.com`
   - Password: `Admin123!@#`
   - Auto Confirm User: ✓ (checked)
5. After creation, go to **SQL Editor** and run:

```sql
-- Get the new user's ID
SELECT id FROM auth.users WHERE email = 'admin@beteasy.com';

-- Insert admin profile (replace USER_ID with actual ID)
INSERT INTO profiles (id, username, full_name, role)
VALUES ('USER_ID_HERE', 'admin', 'System Administrator', 'system_admin')
ON CONFLICT (id) DO UPDATE SET role = 'system_admin';
```

## Verifying Admin Access

After setting up the admin account:

1. Log in with the admin credentials
2. You should see a **"Manage Predictions"** menu item in the sidebar
3. Navigate to `/dashboard/admin/predictions` to view all user predictions

## Current User Upgrade (For Testing)

If you want to upgrade your current user (Ssentongo Richard / @Richard):

```sql
-- Upgrade current user to admin
UPDATE profiles
SET role = 'system_admin'
WHERE username = 'Richard';
```

Then log out and log back in to see the admin features.

## Creating Test Predictions

To test the system with sample predictions:

```sql
-- First, get a user_id and ensure they have tokens
SELECT id, username FROM profiles LIMIT 1;

-- Create a test token for the user (replace USER_ID)
INSERT INTO tokens (user_id, token_type, subscription_period, amount, remaining, status, expiry_date)
VALUES ('USER_ID_HERE', 'standard', 'monthly', 10, 10, 'active', NOW() + INTERVAL '30 days');

-- Create sample predictions (replace USER_ID and TOKEN_ID)
INSERT INTO predictions (
  user_id, match_id, home_team, away_team, league,
  home_odds, draw_odds, away_odds,
  predicted_result, confidence, token_used, result_status
) VALUES
  ('USER_ID_HERE', NULL, 'Manchester United', 'Chelsea', 'Premier League',
   2.5, 3.2, 2.8, 'home_win', 65, 'TOKEN_ID_HERE', 'pending'),
  ('USER_ID_HERE', NULL, 'Arsenal', 'Liverpool', 'Premier League',
   2.1, 3.5, 3.0, 'away_win', 58, 'TOKEN_ID_HERE', 'won'),
  ('USER_ID_HERE', NULL, 'Barcelona', 'Real Madrid', 'La Liga',
   2.3, 3.0, 3.2, 'draw', 45, 'TOKEN_ID_HERE', 'lost');
```

## Quick Test Setup (All in One)

Run this in Supabase SQL Editor to set everything up for testing:

```sql
-- Upgrade current logged-in user to admin
UPDATE profiles
SET role = 'system_admin'
WHERE username = 'Richard';

-- Create tokens for the user
INSERT INTO tokens (user_id, token_type, subscription_period, amount, remaining, status, expiry_date)
SELECT id, 'premium', 'monthly', 100, 95, 'active', NOW() + INTERVAL '30 days'
FROM profiles
WHERE username = 'Richard';

-- Create sample predictions
INSERT INTO predictions (
  user_id, match_id, home_team, away_team, league,
  home_odds, draw_odds, away_odds,
  predicted_result, confidence, token_used, result_status, created_at
)
SELECT
  p.id,
  NULL,
  matches.home_team,
  matches.away_team,
  matches.league,
  matches.home_odds,
  matches.draw_odds,
  matches.away_odds,
  matches.predicted_result,
  matches.confidence,
  t.id,
  'pending',
  NOW() - (matches.days_ago || ' days')::INTERVAL
FROM profiles p
CROSS JOIN tokens t
CROSS JOIN (VALUES
  ('Manchester United', 'Chelsea', 'Premier League', 2.5, 3.2, 2.8, 'home_win', 65, 1),
  ('Arsenal', 'Liverpool', 'Premier League', 2.1, 3.5, 3.0, 'away_win', 58, 2),
  ('Barcelona', 'Real Madrid', 'La Liga', 2.3, 3.0, 3.2, 'draw', 45, 3),
  ('Bayern Munich', 'Borussia Dortmund', 'Bundesliga', 1.8, 3.8, 4.0, 'home_win', 72, 4),
  ('PSG', 'Marseille', 'Ligue 1', 1.5, 4.2, 6.0, 'home_win', 80, 5)
) AS matches(home_team, away_team, league, home_odds, draw_odds, away_odds, predicted_result, confidence, days_ago)
WHERE p.username = 'Richard'
AND t.user_id = p.id
LIMIT 1;
```
