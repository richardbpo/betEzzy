# BetEasy - Next.js Application

A modern football prediction application built with Next.js, Supabase, and TypeScript.

## Features

- AI-powered match predictions
- Real-time match data
- Token-based prediction system
- User authentication with Supabase
- Dark mode support
- Responsive dashboard
- Admin panel for managing predictions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   ├── dashboard/           # Dashboard pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utility libraries
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions
├── supabase/
│   ├── functions/           # Edge functions
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## Database

The application uses Supabase for data persistence. All database migrations are located in `supabase/migrations/`.

### Key Tables

- `profiles`: User profiles
- `matches`: Football matches
- `predictions`: User predictions
- `tokens`: User token packages
- `tickets`: Support tickets

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking

## Features

### For Users
- Make predictions on upcoming matches
- Track prediction history and win rate
- Purchase token packages
- View team statistics
- Submit support tickets

### For Admins
- Manage match data
- Review and update prediction results
- Manage user tokens
- Handle support tickets

## License

All rights reserved © 2024 BetEasy
