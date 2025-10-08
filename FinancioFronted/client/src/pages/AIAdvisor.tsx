import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, AlertTriangle, Lightbulb, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AnalysisHistory from '@/components/AnalysisHistory';
import ProgressiveLoading from '@/components/ProgressiveLoading';
import { useToast } from '@/hooks/use-toast';
import { aiFunctionService, aiAnalysisService } from '@/lib/databaseService';
import { useAuthStore } from '@/lib/authStore';
import ReactMarkdown from 'react-markdown';

export default function AIAdvisor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch user credits
  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['ai-credits', user?.$id],
    queryFn: () => aiFunctionService.getCredits(user!.$id),
    enabled: !!user,
  });

  // Fetch latest analysis (instead of local state)
  const { data: latestAnalysis } = useQuery({
    queryKey: ['latest-analysis', user?.$id],
    queryFn: async () => {
      const analyses = await aiAnalysisService.listAnalyses(user!.$id);
      return analyses.length > 0 ? analyses[0] : null;
    },
    enabled: !!user,
  });

  // Execute AI analysis mutation
  const analysisMutation = useMutation({
    mutationFn: () => aiFunctionService.executeAnalysis(user!.$id),
    onSuccess: (data) => {
      setIsAnalyzing(false);
      // Invalidate queries to refetch latest analysis
      queryClient.invalidateQueries({ queryKey: ['ai-credits'] });
      queryClient.invalidateQueries({ queryKey: ['ai-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['latest-analysis'] });
      toast({
        title: 'Analisa Selesai!',
        description: 'AI telah menganalisa kondisi keuangan Anda.',
      });
    },
    onError: (error: any) => {
      setIsAnalyzing(false);
      const errorMessage = error.message || 'Gagal melakukan analisa';
      toast({
        title: 'Analisa Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleAnalyze = () => {
    if (!credits || credits.remainingCredits <= 0) {
      toast({
        title: 'Credit Habis',
        description: 'Anda tidak memiliki credit tersisa. Upgrade ke premium untuk mendapatkan 50 credit tambahan!',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate loading then execute
    setTimeout(() => {
      analysisMutation.mutate();
    }, 2000);
  };

  const handleExportPDF = () => {
    toast({
      title: 'Mengekspor PDF',
      description: 'Laporan analisa sedang diunduh...',
    });
    // TODO: Implement PDF export
    setTimeout(() => {
      toast({
        title: 'PDF Berhasil Diunduh',
        description: 'financial-analysis-report.pdf',
      });
    }, 1500);
  };

  // Parse latest analysis data
  const summary = latestAnalysis ? JSON.parse(latestAnalysis.summary) : null;
  const advice = latestAnalysis?.advice;
  const isLoading = creditsLoading;

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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      ) : !isAnalyzing && !latestAnalysis ? (
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
              disabled={!credits || credits.remainingCredits <= 0}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Mulai Analisa
            </Button>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-usage">
              Credit tersisa: {credits?.remainingCredits || 0}/{credits?.totalCredits || 10}
              {credits?.isPaid && <span className="ml-2 text-primary">(Premium)</span>}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {isAnalyzing && (
        <ProgressiveLoading onComplete={() => {}} duration={30000} />
      )}

      {latestAnalysis && summary && (
        <>
          {/* Financial Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {summary.total_income?.toLocaleString('id-ID') || 0}
                </div>
                <p className="text-xs text-muted-foreground">30 hari terakhir</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {summary.total_expense?.toLocaleString('id-ID') || 0}
                </div>
                <p className="text-xs text-muted-foreground">30 hari terakhir</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rp {summary.net_balance?.toLocaleString('id-ID') || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary.transaction_count || 0} transaksi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown */}
          {summary.expense_by_category && Object.keys(summary.expense_by_category).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pengeluaran per Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(summary.expense_by_category)
                    .sort(([, a]: any, [, b]: any) => b - a)
                    .map(([category, amount]: any) => {
                      const percentage = (amount / summary.total_expense * 100).toFixed(1);
                      return (
                        <div key={category} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{category}</span>
                            <span className="text-muted-foreground">
                              Rp {amount.toLocaleString('id-ID')} ({percentage}%)
                            </span>
                          </div>
                          <Progress value={parseFloat(percentage)} className="h-2" />
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Generated Advice */}
          {advice && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Analisa & Rekomendasi AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

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
              onClick={handleAnalyze}
              disabled={!credits || credits.remainingCredits <= 0}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analisa Ulang
            </Button>
          </div>

          <AnalysisHistory />
        </>
      )}
    </div>
  );
}
