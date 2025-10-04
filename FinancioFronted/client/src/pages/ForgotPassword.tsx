import { useState } from 'react';
import { Leaf, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.resetPassword(email);
      
      toast({
        title: "Recovery Email Sent! 📧",
        description: `Check your inbox at ${email}`,
      });
      
      setSubmitted(true);
    } catch (error: any) {
      toast({
        title: "Failed to Send Email",
        description: error.message || "Could not send recovery email",
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
            <h1 className="text-3xl font-bold" data-testid="text-page-title">
              Lupa Password?
            </h1>
            <p className="text-muted-foreground mt-2">
              {submitted
                ? 'Cek email Anda untuk reset password'
                : 'Masukkan email Anda untuk reset password'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="andi@warungkopi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                  required
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-reset" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Kirim Link Reset'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-md text-center" data-testid="text-success-message">
                <p className="text-sm">
                  Kami sudah mengirimkan link reset password ke <strong>{email}</strong>
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full" data-testid="button-back-to-login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          )}

          {!submitted && (
            <div className="mt-6">
              <Link href="/login">
                <Button variant="ghost" className="w-full" data-testid="link-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
