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
        title: '✅ Settings Saved',
        description: 'Your changes have been saved successfully',
      });
    } catch (error: any) {
      toast({
        title: '❌ Save Failed',
        description: error.message || 'An error occurred while saving settings',
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
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your preferences and business information
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="e.g. John's Coffee Shop"
                  value={prefs.businessName || ''}
                  onChange={(e) => setPrefs({ ...prefs, businessName: e.target.value })}
                  data-testid="input-business-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Input
                  id="business-type"
                  placeholder="e.g. E-commerce, SaaS, Consulting"
                  value={prefs.businessType || ''}
                  onChange={(e) => setPrefs({ ...prefs, businessType: e.target.value })}
                  data-testid="input-business-type"
                />
                <p className="text-xs text-muted-foreground">
                  This helps our AI provide more relevant financial advice
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-name">Owner Name</Label>
                <Input
                  id="owner-name"
                  placeholder="e.g. John Doe"
                  value={prefs.ownerName || ''}
                  onChange={(e) => setPrefs({ ...prefs, ownerName: e.target.value })}
                  data-testid="input-owner-name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={prefs.currency}
                  onValueChange={(value) => setPrefs({ ...prefs, currency: value })}
                >
                  <SelectTrigger id="currency" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idr">Indonesian Rupiah (IDR)</SelectItem>
                    <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
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
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Weekly Email Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly financial summary via email every Monday
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" data-testid="button-cancel">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading} data-testid="button-save">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
