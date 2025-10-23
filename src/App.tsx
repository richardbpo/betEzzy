import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHome from './pages/DashboardHome';
import PredictionsPage from './pages/PredictionsPage';
import TokensPage from './pages/TokensPage';
import HistoryPage from './pages/HistoryPage';
import SupportPage from './pages/SupportPage';
import EventsPage from './pages/EventsPage';
import TeamSearchPage from './pages/TeamSearchPage';
import UpcomingMatchesPage from './pages/UpcomingMatchesPage';
import AdminPredictionsPage from './pages/AdminPredictionsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/predictions"
        element={
          <ProtectedRoute>
            <PredictionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tokens"
        element={
          <ProtectedRoute>
            <TokensPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/support"
        element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/team-search"
        element={
          <ProtectedRoute>
            <TeamSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/upcoming-matches"
        element={
          <ProtectedRoute>
            <UpcomingMatchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/predictions"
        element={
          <ProtectedRoute>
            <AdminPredictionsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
