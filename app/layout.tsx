import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeProvider';

export const metadata: Metadata = {
  title: 'BetEasy - Smart Football Predictions',
  description: 'AI-powered football match predictions and betting insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
