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
            Riwayat Analisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Memuat riwayat...</p>
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
            Riwayat Analisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belum ada riwayat analisa. Mulai analisa pertama Anda!
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
          Riwayat Analisa
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
                    {new Date(analysis.analysisDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {analysis.periodDays} hari
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Pendapatan</p>
                    <p className="font-medium text-green-600">
                      Rp {summary.total_income?.toLocaleString('id-ID') || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Pengeluaran</p>
                    <p className="font-medium text-red-600">
                      Rp {summary.total_expense?.toLocaleString('id-ID') || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Net Balance</p>
                    <p className={`font-medium ${summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Rp {summary.net_balance?.toLocaleString('id-ID') || 0}
                    </p>
                  </div>
                </div>

                {analysis.advice && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary font-medium">
                      Lihat Rekomendasi AI
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
