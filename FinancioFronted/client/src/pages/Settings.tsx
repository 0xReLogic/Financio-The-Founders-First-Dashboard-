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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Pengaturan disimpan',
      description: 'Perubahan Anda telah berhasil disimpan',
    });
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
                  defaultValue="Warung Kopi Pak Andi"
                  data-testid="input-business-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Jenis Bisnis</Label>
                <Select defaultValue="food">
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
                  defaultValue="Pak Andi"
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
                <Select defaultValue="idr">
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
                <Select defaultValue="id">
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
                <Switch id="email-notifications" defaultChecked data-testid="switch-email" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transaction-alerts">Alert Transaksi</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifikasi untuk transaksi besar
                  </p>
                </div>
                <Switch id="transaction-alerts" defaultChecked data-testid="switch-transaction-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-insights">AI Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Rekomendasi otomatis dari AI
                  </p>
                </div>
                <Switch id="ai-insights" defaultChecked data-testid="switch-ai-insights" />
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
                <Select defaultValue="system">
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
                <Select defaultValue="green">
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
        <Button onClick={handleSave} data-testid="button-save">
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
