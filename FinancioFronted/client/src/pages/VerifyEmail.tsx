import { useState, useEffect } from 'react';
import { Leaf, Loader2, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/authService';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get('userId');
      const secret = params.get('secret');

      if (!userId || !secret) {
        setError('Invalid verification link');
        setIsVerifying(false);
        toast({
          title: "Invalid Link",
          description: "This verification link is invalid or expired",
          variant: "destructive",
        });
        return;
      }

      try {
        await authService.verifyEmail(userId, secret);
        setSuccess(true);
        toast({
          title: "Email Verified! ✅",
          description: "Your email has been successfully verified",
        });
        setTimeout(() => setLocation('/login'), 3000);
      } catch (err: any) {
        setError(err.message || 'Verification failed');
        toast({
          title: "Verification Failed",
          description: err.message || "Link may be expired or invalid",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [toast, setLocation]);

  // Determine icon based on state
  const getIcon = () => {
    if (isVerifying) return <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />;
    if (success) return <CheckCircle className="w-10 h-10 text-primary-foreground" />;
    return <Leaf className="w-10 h-10 text-primary-foreground" />;
  };

  // Determine title based on state
  const getTitle = () => {
    if (isVerifying) return 'Verifying Email...';
    if (success) return 'Email Verified!';
    return 'Verification Failed';
  };

  // Determine description based on state
  const getDescription = () => {
    if (isVerifying) return 'Please wait while we verify your email';
    if (success) return 'Redirecting to login...';
    return 'Could not verify your email';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fee7] to-[#fefce8] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center">
              {getIcon()}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {getTitle()}
            </h1>
            <p className="text-muted-foreground mt-2">
              {getDescription()}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!isVerifying && (
            <div className="space-y-4">
              {success ? (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-md text-center">
                  <p className="text-sm">
                    Your email has been verified successfully! You can now login to your account.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-center">
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                </div>
              )}
              
              <Link href="/login">
                <Button variant={success ? "default" : "outline"} className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
