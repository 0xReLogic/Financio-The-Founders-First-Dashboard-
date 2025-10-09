import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/authStore';
import { authService } from '@/lib/authService';
import { useState, useEffect } from 'react';

interface UserPreferences {
  businessName?: string;
  businessType?: string;
  ownerName?: string;
  currency?: string;
  dateFormat?: string;
  emailNotifications?: boolean;
  transactionAlerts?: boolean;
  aiInsights?: boolean;
  theme?: string;
  accentColor?: string;
}

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>({
    businessName: '',
    businessType: 'food',
    ownerName: user?.name || '',
    currency: 'idr',
    dateFormat: 'id',
    emailNotifications: true,
    transactionAlerts: true,
    aiInsights: true,
    theme: 'system',
    accentColor: 'green',
  });

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser?.prefs) {
          setPrefs((prev) => ({
            ...prev,
            ...currentUser.prefs,
            ownerName: currentUser.name,
          }));
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update user preferences in Appwrite
      const { account } = await import('@/lib/appwrite');
      await account.updatePrefs(prefs);

      // Update name if changed
      if (prefs.ownerName && prefs.ownerName !== user?.name) {
        await authService.updateName(prefs.ownerName);
      }

      toast({
        title: '✅ Pengaturan disimpan',
        description: 'Perubahan Anda telah berhasil disimpan',
      });
    } catch (error: any) {
      toast({
        title: '❌ Gagal menyimpan',
        description: error.message || 'Terjadi kesalahan saat menyimpan pengaturan',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Pengaturan
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola preferensi dan informasi bisnis Anda
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="appearance">Tampilan</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bisnis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Nama Bisnis</Label>
                <Input
                  id="business-name"
                  placeholder="Warung Kopi Pak Andi"
                  value={prefs.businessName || ''}
                  onChange={(e) => setPrefs({ ...prefs, businessName: e.target.value })}
                  data-testid="input-business-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Jenis Bisnis</Label>
                <Select
                  value={prefs.businessType}
                  onValueChange={(value) => setPrefs({ ...prefs, businessType: value })}
                >
                  <SelectTrigger id="business-type" data-testid="select-business-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Makanan & Minuman</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="service">Jasa</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-name">Nama Pemilik</Label>
                <Input
                  id="owner-name"
                  placeholder="Pak Andi"
                  value={prefs.ownerName || ''}
                  onChange={(e) => setPrefs({ ...prefs, ownerName: e.target.value })}
                  data-testid="input-owner-name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferensi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Mata Uang</Label>
                <Select
                  value={prefs.currency}
                  onValueChange={(value) => setPrefs({ ...prefs, currency: value })}
                >
                  <SelectTrigger id="currency" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idr">Rupiah (IDR)</SelectItem>
                    <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Format Tanggal</Label>
                <Select
                  value={prefs.dateFormat}
                  onValueChange={(value) => setPrefs({ ...prefs, dateFormat: value })}
                >
                  <SelectTrigger id="date-format" data-testid="select-date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">DD/MM/YYYY</SelectItem>
                    <SelectItem value="us">MM/DD/YYYY</SelectItem>
                    <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima update via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={prefs.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, emailNotifications: checked })
                  }
                  data-testid="switch-email"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transaction-alerts">Alert Transaksi</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi untuk transaksi besar
                  </p>
                </div>
                <Switch
                  id="transaction-alerts"
                  checked={prefs.transactionAlerts}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, transactionAlerts: checked })
                  }
                  data-testid="switch-transaction-alerts"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-insights">AI Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Rekomendasi otomatis dari AI
                  </p>
                </div>
                <Switch
                  id="ai-insights"
                  checked={prefs.aiInsights}
                  onCheckedChange={(checked) => setPrefs({ ...prefs, aiInsights: checked })}
                  data-testid="switch-ai-insights"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  value={prefs.theme}
                  onValueChange={(value) => setPrefs({ ...prefs, theme: value })}
                >
                  <SelectTrigger id="theme" data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">Warna Aksen</Label>
                <Select
                  value={prefs.accentColor}
                  onValueChange={(value) => setPrefs({ ...prefs, accentColor: value })}
                >
                  <SelectTrigger id="accent-color" data-testid="select-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green (Default)</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" data-testid="button-cancel">
          Batal
        </Button>
        <Button onClick={handleSave} disabled={loading} data-testid="button-save">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </div>
  );
}
