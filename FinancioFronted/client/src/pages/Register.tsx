import { useState } from 'react';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', formData);
    // todo: remove mock functionality - redirect to dashboard for demo
    setLocation('/dashboard');
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
              Daftar Financio
            </h1>
            <p className="text-muted-foreground mt-2">
              Mulai kelola keuangan bisnis dengan lebih baik
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Pak Andi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Nama Bisnis</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Warung Kopi Pak Andi"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                data-testid="input-business-name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="andi@warungkopi.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  data-testid="input-password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ketik ulang password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  data-testid="input-confirm-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" data-testid="button-register">
              Daftar Sekarang
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Sudah punya akun?{' '}
            <Link href="/login">
              <a className="text-primary hover:underline font-semibold" data-testid="link-login">
                Masuk di sini
              </a>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
