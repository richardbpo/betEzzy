import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface FootballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  matchDate: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const dateFilter = url.searchParams.get('date');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    let startDate = today;
    let endDate = tomorrow;

    if (dateFilter === 'today') {
      endDate = tomorrow;
    } else if (dateFilter === 'tomorrow') {
      startDate = tomorrow;
      endDate = dayAfterTomorrow;
    } else {
      endDate = dayAfterTomorrow;
    }

    const mockMatches: FootballMatch[] = [
      {
        id: 'match-001',
        homeTeam: 'Manchester United',
        awayTeam: 'Chelsea',
        league: 'Premier League',
        matchDate: today.toISOString(),
        homeOdds: 2.5,
        drawOdds: 3.2,
        awayOdds: 2.8
      },
      {
        id: 'match-002',
        homeTeam: 'Liverpool',
        awayTeam: 'Arsenal',
        league: 'Premier League',
        matchDate: tomorrow.toISOString(),
        homeOdds: 2.1,
        drawOdds: 3.5,
        awayOdds: 3.0
      },
      {
        id: 'match-003',
        homeTeam: 'Barcelona',
        awayTeam: 'Real Madrid',
        league: 'La Liga',
        matchDate: tomorrow.toISOString(),
        homeOdds: 2.3,
        drawOdds: 3.0,
        awayOdds: 3.2
      },
      {
        id: 'match-004',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Borussia Dortmund',
        league: 'Bundesliga',
        matchDate: today.toISOString(),
        homeOdds: 1.9,
        drawOdds: 3.8,
        awayOdds: 3.5
      },
      {
        id: 'match-005',
        homeTeam: 'Juventus',
        awayTeam: 'Inter Milan',
        league: 'Serie A',
        matchDate: tomorrow.toISOString(),
        homeOdds: 2.4,
        drawOdds: 3.1,
        awayOdds: 2.9
      },
      {
        id: 'match-006',
        homeTeam: 'Paris Saint-Germain',
        awayTeam: 'Marseille',
        league: 'Ligue 1',
        matchDate: today.toISOString(),
        homeOdds: 1.6,
        drawOdds: 4.0,
        awayOdds: 5.5
      },
      {
        id: 'match-007',
        homeTeam: 'Manchester City',
        awayTeam: 'Tottenham',
        league: 'Premier League',
        matchDate: tomorrow.toISOString(),
        homeOdds: 1.7,
        drawOdds: 4.2,
        awayOdds: 4.5
      },
      {
        id: 'match-008',
        homeTeam: 'Atletico Madrid',
        awayTeam: 'Sevilla',
        league: 'La Liga',
        matchDate: today.toISOString(),
        homeOdds: 2.0,
        drawOdds: 3.3,
        awayOdds: 3.6
      }
    ];

    for (const match of mockMatches) {
      const matchDate = new Date(match.matchDate);
      if (matchDate >= startDate && matchDate < endDate) {
        const { error } = await supabase
          .from('matches')
          .upsert(
            {
              external_id: match.id,
              home_team: match.homeTeam,
              away_team: match.awayTeam,
              league: match.league,
              match_date: match.matchDate,
              home_odds: match.homeOdds,
              draw_odds: match.drawOdds,
              away_odds: match.awayOdds,
              status: 'upcoming',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'external_id' }
          );

        if (error) {
          console.error('Error upserting match:', error);
        }
      }
    }

    const { data: matches, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .gte('match_date', startDate.toISOString())
      .lt('match_date', endDate.toISOString())
      .eq('status', 'upcoming')
      .order('match_date', { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    return new Response(JSON.stringify({ matches: matches || [] }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in fetch-matches function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});