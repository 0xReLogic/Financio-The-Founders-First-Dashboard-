import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiAnalysisService } from '@/lib/databaseService';
import { useAuthStore } from '@/lib/authStore';
import ReactMarkdown from 'react-markdown';

export default function AnalysisHistory() {
  const { user } = useAuthStore();

  const { data: analyses, isLoading } = useQuery({
    queryKey: ['ai-analyses', user?.$id],
    queryFn: () => aiAnalysisService.listAnalyses(user!.$id),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No analysis history yet. Start your first analysis!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Analysis History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {analyses.map((analysis, index) => {
            const summary = JSON.parse(analysis.summary);
            return (
              <div
                key={analysis.$id}
                className="pb-6 border-b last:border-0 last:pb-0 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {new Date(analysis.analysisDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {analysis.periodDays} days
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Income</p>
                    <p className="font-medium text-green-600">
                      $ {summary.total_income?.toLocaleString('en-US') || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Expense</p>
                    <p className="font-medium text-red-600">
                      $ {summary.total_expense?.toLocaleString('en-US') || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Net Balance</p>
                    <p className={`font-medium ${summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      $ {summary.net_balance?.toLocaleString('en-US') || 0}
                    </p>
                  </div>
                </div>

                {analysis.advice && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary font-medium">
                      View AI Recommendations
                    </summary>
                    <div className="mt-2 prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{analysis.advice}</ReactMarkdown>
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
