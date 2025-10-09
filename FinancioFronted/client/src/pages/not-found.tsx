import { useLocation } from 'wouter';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 border-destructive/20">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-6xl font-bold text-destructive mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sorry, the page you are looking for does not exist or has been moved. 
            Please check the URL or return to the dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              To Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
