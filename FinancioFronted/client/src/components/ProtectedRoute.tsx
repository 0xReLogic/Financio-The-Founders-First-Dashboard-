import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

export function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated after loading
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isLoading, isAuthenticated, setLocation]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
