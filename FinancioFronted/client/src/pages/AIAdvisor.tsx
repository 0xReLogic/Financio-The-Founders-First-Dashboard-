import { useState } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AnalysisHistory from '@/components/AnalysisHistory';
import ProgressiveLoading from '@/components/ProgressiveLoading';
import { useToast } from '@/hooks/use-toast';
import { mockAIAnalysis } from '@/lib/mockData';

export default function AIAdvisor() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setShowResults(true);
    toast({
      title: 'Analisa Selesai!',
      description: 'AI telah menganalisa kondisi keuangan Anda.',
    });
  };

  const handleExportPDF = () => {
    toast({
      title: 'Mengekspor PDF',
      description: 'Laporan analisa sedang diunduh...',
    });
    // Mock PDF export
    setTimeout(() => {
      toast({
        title: 'PDF Berhasil Diunduh',
        description: 'financial-analysis-report.pdf',
      });
    }, 1500);
  };

  const scoreColor =
    mockAIAnalysis.healthScore >= 70
      ? '#65a30d'
      : mockAIAnalysis.healthScore >= 40
        ? '#facc15'
        : '#dc2626';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          AI Financial Advisor
        </h1>
        <p className="text-muted-foreground mt-1">
          Dapatkan insight komprehensif tentang kesehatan keuangan bisnis Anda
        </p>
      </div>

      {!isAnalyzing && !showResults && (
        <Card className="border-primary/20">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Analisa Keuangan Komprehensif
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              AI kami akan menganalisa 30 hari terakhir dari transaksi Anda dan
              memberikan insight mendalam tentang kesehatan keuangan bisnis Anda.
            </p>
            <Button
              size="lg"
              onClick={handleAnalyze}
              data-testid="button-analyze"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Mulai Analisa
            </Button>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-usage">
              Penggunaan: {mockAIAnalysis.usageCount}/{mockAIAnalysis.usageLimit}{' '}
              bulan ini
            </p>
          </CardContent>
        </Card>
      )}

      {isAnalyzing && (
        <ProgressiveLoading onComplete={handleAnalysisComplete} duration={3000} />
      )}

      {showResults && (
        <>
          <Card data-testid="card-health-score">
            <CardHeader>
              <CardTitle>Skor Kesehatan Keuangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="relative">
                  <svg width="120" height="120" className="transform -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="10"
                      strokeDasharray={`${mockAIAnalysis.healthScore * 3.14} ${314 - mockAIAnalysis.healthScore * 3.14}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: scoreColor }}>
                        {mockAIAnalysis.healthScore}
                      </div>
                      <div className="text-xs text-muted-foreground">dari 100</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground mb-2">
                    Kesehatan keuangan bisnis Anda berada pada level{' '}
                    <span className="font-semibold" style={{ color: scoreColor }}>
                      {mockAIAnalysis.healthScore >= 70
                        ? 'BAIK'
                        : mockAIAnalysis.healthScore >= 40
                          ? 'CUKUP'
                          : 'PERLU PERHATIAN'}
                    </span>
                  </p>
                  <Progress value={mockAIAnalysis.healthScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-concerns">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Perhatian ({mockAIAnalysis.concerns.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mockAIAnalysis.concerns.map((concern, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-destructive/5 rounded-md border border-destructive/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{concern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="card-recommendations">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#facc15]" />
                Rekomendasi ({mockAIAnalysis.recommendations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mockAIAnalysis.recommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#65a30d]/5 rounded-md border border-[#65a30d]/20"
                  >
                    <Lightbulb className="w-4 h-4 text-[#facc15] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              data-testid="button-export-pdf"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
              data-testid="button-new-analysis"
            >
              Analisa Baru
            </Button>
          </div>

          <AnalysisHistory />
        </>
      )}
    </div>
  );
}
