/*
  # BetEasy Platform - Initial Database Schema

  ## Overview
  Complete database schema for the BetEasy football prediction platform serving East Africa.

  ## New Tables

  ### 1. profiles
  Extended user profile information linked to auth.users
  - `id` (uuid, references auth.users)
  - `username` (text, unique)
  - `full_name` (text)
  - `phone` (text)
  - `country` (text) - East African countries
  - `role` (text) - system_admin, manager, system_user, guest
  - `avatar_url` (text, optional)
  - `bio` (text, optional)
  - `win_rate` (numeric) - calculated win percentage
  - `total_predictions` (integer)
  - `correct_predictions` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. tokens
  Token management for predictions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `token_type` (text) - standard, premium
  - `subscription_period` (text) - daily, weekly, monthly
  - `amount` (integer) - number of tokens
  - `remaining` (integer) - tokens left
  - `price_paid` (numeric)
  - `status` (text) - pending, approved, active, expired
  - `request_date` (timestamptz)
  - `approval_date` (timestamptz, optional)
  - `expiry_date` (timestamptz)
  - `created_at` (timestamptz)

  ### 3. matches
  Football matches available for prediction
  - `id` (uuid, primary key)
  - `home_team` (text)
  - `away_team` (text)
  - `league` (text)
  - `match_date` (timestamptz)
  - `home_odds` (numeric)
  - `draw_odds` (numeric)
  - `away_odds` (numeric)
  - `status` (text) - upcoming, live, completed
  - `actual_result` (text, optional) - home_win, away_win, draw
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. predictions
  User predictions on matches
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `match_id` (uuid, references matches)
  - `predicted_result` (text) - home_win, away_win, draw
  - `confidence` (integer) - 0-100
  - `token_used` (uuid, references tokens)
  - `is_correct` (boolean, optional)
  - `created_at` (timestamptz)

  ### 5. tickets
  Support ticket system
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `subject` (text)
  - `description` (text)
  - `severity` (text) - low, medium, high
  - `status` (text) - active, under_review, resolved
  - `evidence_url` (text, optional)
  - `notes` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - `resolved_at` (timestamptz, optional)
  - `resolved_by` (uuid, optional, references profiles)

  ### 6. events
  Training and coaching events
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `event_type` (text) - training, coaching
  - `event_date` (timestamptz)
  - `location` (text)
  - `max_participants` (integer)
  - `status` (text) - pending, active, completed, cancelled
  - `created_by` (uuid, references profiles)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. event_registrations
  Event attendance tracking
  - `id` (uuid, primary key)
  - `event_id` (uuid, references events)
  - `user_id` (uuid, references profiles)
  - `status` (text) - registered, attended, cancelled
  - `registered_at` (timestamptz)

  ### 8. promo_codes
  Promotional codes for discounts
  - `id` (uuid, primary key)
  - `code` (text, unique)
  - `discount_percentage` (integer)
  - `max_uses` (integer)
  - `used_count` (integer)
  - `valid_from` (timestamptz)
  - `valid_until` (timestamptz)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users based on roles
  - Users can only view/edit their own data unless admin
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  country text DEFAULT 'Uganda',
  role text DEFAULT 'system_user' CHECK (role IN ('system_admin', 'manager', 'system_user', 'guest')),
  avatar_url text,
  bio text,
  win_rate numeric DEFAULT 0,
  total_predictions integer DEFAULT 0,
  correct_predictions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  token_type text DEFAULT 'standard' CHECK (token_type IN ('standard', 'premium')),
  subscription_period text DEFAULT 'daily' CHECK (subscription_period IN ('daily', 'weekly', 'monthly')),
  amount integer DEFAULT 1,
  remaining integer DEFAULT 0,
  price_paid numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'expired')),
  request_date timestamptz DEFAULT now(),
  approval_date timestamptz,
  expiry_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team text NOT NULL,
  away_team text NOT NULL,
  league text DEFAULT 'Premier League',
  match_date timestamptz NOT NULL,
  home_odds numeric NOT NULL,
  draw_odds numeric NOT NULL,
  away_odds numeric NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  actual_result text CHECK (actual_result IN ('home_win', 'away_win', 'draw')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  predicted_result text NOT NULL CHECK (predicted_result IN ('home_win', 'away_win', 'draw')),
  confidence integer DEFAULT 50 CHECK (confidence >= 0 AND confidence <= 100),
  token_used uuid REFERENCES tokens(id),
  is_correct boolean,
  created_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'under_review', 'resolved')),
  evidence_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_type text DEFAULT 'training' CHECK (event_type IN ('training', 'coaching')),
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  max_participants integer DEFAULT 50,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percentage integer DEFAULT 10 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  max_uses integer DEFAULT 100,
  used_count integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for tokens
CREATE POLICY "Users can view own tokens"
  ON tokens FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

CREATE POLICY "Users can request tokens"
  ON tokens FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update tokens"
  ON tokens FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

-- RLS Policies for matches
CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage matches"
  ON matches FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

-- RLS Policies for predictions
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

CREATE POLICY "Users can create predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for tickets
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

-- RLS Policies for events
CREATE POLICY "Users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

-- RLS Policies for event_registrations
CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('system_admin', 'manager')
  ));

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel own registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for promo_codes
CREATE POLICY "Users can view active promo codes"
  ON promo_codes FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage promo codes"
  ON promo_codes FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'system_admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'system_admin'
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
