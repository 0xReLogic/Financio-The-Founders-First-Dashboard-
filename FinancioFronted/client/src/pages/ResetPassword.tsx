import { useState, useEffect } from 'react';
import { Leaf, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/authService';

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  // Get userId and secret from URL params
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIdParam = params.get('userId');
    const secretParam = params.get('secret');

    if (!userIdParam || !secretParam) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or expired",
        variant: "destructive",
      });
      setTimeout(() => setLocation('/forgot-password'), 2000);
      return;
    }

    setUserId(userIdParam);
    setSecret(secretParam);
  }, [toast, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.completePasswordRecovery(userId, secret, newPassword);
      
      toast({
        title: "Password Updated! 🎉",
        description: "Your password has been successfully reset",
      });
      
      setSuccess(true);
      setTimeout(() => setLocation('/login'), 2000);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Could not reset password. Link may be expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fee7] to-[#fefce8] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              {success 
                ? 'Password updated successfully!' 
                : 'Enter your new password'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={!userId || !secret}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ketik ulang password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={!userId || !secret}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !userId || !secret}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
                <p className="text-sm">
                  Redirecting to login page...
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {!success && (
            <div className="mt-6">
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
