import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AnalysisHistory from '@/components/AnalysisHistory';
import ProgressiveLoading from '@/components/ProgressiveLoading';
import { useToast } from '@/hooks/use-toast';
import { aiFunctionService } from '@/lib/databaseService';
import { useAuthStore } from '@/lib/authStore';
import { exportAnalysisToPDF } from '@/lib/pdfExport';
import ReactMarkdown from 'react-markdown';

export default function AIAdvisor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Fetch user credits
  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['ai-credits', user?.$id],
    queryFn: () => aiFunctionService.getCredits(user!.$id),
    enabled: !!user,
  });

  // Execute AI analysis mutation
  const analysisMutation = useMutation({
    mutationFn: () => aiFunctionService.executeAnalysis(user!.$id),
    onSuccess: (data: any) => {
      setAnalysisResult(data);
      setIsAnalyzing(false);
      queryClient.invalidateQueries({ queryKey: ['ai-credits'] });
      queryClient.invalidateQueries({ queryKey: ['ai-analyses'] });
      toast({
        title: 'Analysis Complete!',
        description: 'The AI has analyzed your financial condition.',
      });
    },
    onError: (error: any) => {
      setIsAnalyzing(false);
      const errorMessage = error.message || 'Failed to perform analysis';
      toast({
        title: 'Analysis Failed',
        description: errorMessage, 
        variant: 'destructive',
      });
    },
  });

  const handleAnalyze = () => {
    if (!credits || credits.remainingCredits <= 0) {
      toast({
        title: 'Credits Depleted',
        description: 'You have no credits left. Upgrade to premium to get 50 additional credits!',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    analysisMutation.mutate();
  };

  const handleExportPDF = async () => {
    if (!analysisResult || !summary || !advice) {
      toast({
        title: 'No Data',
        description: 'No analysis data available to export',
        variant: 'destructive',
      });
      return;
    }

    try {
      toast({
        title: 'Generating PDF',
        description: 'Your financial analysis report is being generated...',
      });

      await exportAnalysisToPDF(summary, advice, user?.name);

      toast({
        title: 'PDF Downloaded Successfully',
        description: 'Your financial analysis report has been downloaded',
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF report',
        variant: 'destructive',
      });
    }
  };

  // Parse analysis data - analysisResult from function is already an object
  const summary = analysisResult?.summary || null;
  const advice = analysisResult?.advice;
  const isLoading = creditsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          AI Financial Advisor
        </h1>
        <p className="text-muted-foreground mt-1">
          Get comprehensive insights into your business's financial health
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      ) : !isAnalyzing && !analysisResult ? (
        <Card className="border-primary/20">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Comprehensive Financial Analysis
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our AI will analyze the last 30 days of your transactions and
              provide deep insights into your business's financial health.
            </p>
            <Button
              size="lg"
              onClick={handleAnalyze}
              data-testid="button-analyze"
              disabled={!credits || credits.remainingCredits <= 0}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-usage">
              Credits remaining: {credits?.remainingCredits || 0}/{credits?.totalCredits || 10}
              {credits?.isPaid && <span className="ml-2 text-primary">(Premium)</span>}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {isAnalyzing && (
        <ProgressiveLoading onComplete={() => {}} duration={30000} />
      )}

      {analysisResult && summary && (
        <>
          {/* Financial Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summary.total_income?.toLocaleString('en-US') || 0}
                </div>
                <p className="text-xs text-muted-foreground">last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summary.total_expense?.toLocaleString('en-US') || 0}
                </div>
                <p className="text-xs text-muted-foreground">last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${summary.net_balance?.toLocaleString('en-US') || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary.transaction_count || 0} transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown */}
          {summary.expense_by_category && Object.keys(summary.expense_by_category).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
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
                              ${amount.toLocaleString('en-US')} ({percentage}%)
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
                  AI Analysis & Recommendations
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
              New Analysis
            </Button>
          </div>
        </>
      )}

      {/* History Section - Always visible */}
      <AnalysisHistory />
    </div>
  );
}
