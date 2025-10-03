import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Leaf, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import heroImage from '@assets/stock_images/business_success_fin_1ae5d2d6.jpg';

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Dashboard Visual',
      description: 'Lihat kesehatan finansial bisnis Anda dalam sekali pandang dengan charts interaktif',
    },
    {
      icon: Sparkles,
      title: 'AI Financial Advisor',
      description: 'Dapatkan rekomendasi cerdas dari AI untuk optimasi keuangan bisnis Anda',
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Data keuangan Anda tersimpan aman dengan enkripsi enterprise-grade',
    },
    {
      icon: Zap,
      title: 'Super Cepat',
      description: 'Input transaksi dalam hitungan detik, tidak perlu Excel yang ribet',
    },
  ];

  const benefits = [
    'Hemat waktu hingga 5 jam per minggu',
    'Insight keuangan real-time',
    'Tidak perlu keahlian akuntansi',
    'Cocok untuk UMKM & founder',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Financio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button data-testid="button-register">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f7fee7] to-[#fefce8] -z-10" />
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                  Trusted by 1000+ UMKM Indonesia
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight" data-testid="text-hero-title">
                Kelola Keuangan Bisnis{' '}
                <span className="text-primary">Lebih Mudah</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Beralih dari kekacauan Excel ke dashboard keuangan yang bersih, visual, dan cerdas. 
                Dilengkapi AI Advisor untuk insight bisnis instan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-cta-register">
                    Mulai Gratis Sekarang
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-cta-demo">
                    Lihat Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Gratis 30 hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Tanpa kartu kredit</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-[#facc15]/20 rounded-2xl blur-3xl -z-10" />
              <img
                src={heroImage}
                alt="Business owner managing finances"
                className="rounded-2xl shadow-2xl w-full"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Fitur yang Bikin Hidup Lebih Mudah
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola keuangan bisnis dalam satu dashboard
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-[#f7fee7] to-[#fefce8]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Kenapa Founder & UMKM Pilih Financio?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-background rounded-lg"
                data-testid={`benefit-${index}`}
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Siap untuk Keuangan Bisnis yang Lebih Sehat?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join ribuan founder dan UMKM yang sudah beralih dari Excel ke Financio
          </p>
          <Link href="/register">
            <Button size="lg" data-testid="button-final-cta">
              Mulai Gratis Sekarang
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Financio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Financio. Dashboard keuangan untuk bootstrapped founders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
