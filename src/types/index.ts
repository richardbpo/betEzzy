export type UserRole = 'system_admin' | 'manager' | 'system_user' | 'guest';

export type TokenType = 'standard' | 'premium';

export type SubscriptionPeriod = 'daily' | 'weekly' | 'monthly';

export type TokenStatus = 'pending' | 'approved' | 'active' | 'expired';

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type MatchResult = 'home_win' | 'away_win' | 'draw';

export type TicketSeverity = 'low' | 'medium' | 'high';

export type TicketStatus = 'active' | 'under_review' | 'resolved';

export type EventType = 'training' | 'coaching';

export type EventStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  phone?: string;
  country: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  win_rate: number;
  total_predictions: number;
  correct_predictions: number;
  created_at: string;
  updated_at: string;
}

export interface Token {
  id: string;
  user_id: string;
  token_type: TokenType;
  subscription_period: SubscriptionPeriod;
  amount: number;
  remaining: number;
  price_paid: number;
  status: TokenStatus;
  request_date: string;
  approval_date?: string;
  expiry_date: string;
  created_at: string;
}

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  league: string;
  match_date: string;
  home_odds: number;
  draw_odds: number;
  away_odds: number;
  status: MatchStatus;
  actual_result?: MatchResult;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  predicted_result: MatchResult;
  confidence: number;
  token_used?: string;
  is_correct?: boolean;
  created_at: string;
  match?: Match;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  severity: TicketSeverity;
  status: TicketStatus;
  evidence_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: EventType;
  event_date: string;
  location: string;
  max_participants: number;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  max_uses: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}
