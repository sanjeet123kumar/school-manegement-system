import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute ensures only authenticated users can access certain pages.
 * 
 * How it works:
 * 1. Checks if user is logged in via AuthContext
 * 2. Shows loading spinner while checking authentication
 * 3. Redirects to /auth if user is not authenticated
 * 4. Renders children (protected page) if user is authenticated
 * 
 * Usage: Wrap the Layout component with this to protect all dashboard pages
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
