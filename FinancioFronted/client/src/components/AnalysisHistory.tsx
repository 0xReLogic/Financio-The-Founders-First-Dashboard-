import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AnalysisHistoryItem {
  id: string;
  date: string;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
  summary: string;
}

const mockHistory: AnalysisHistoryItem[] = [
  {
    id: '1',
    date: '2025-10-01',
    healthScore: 72,
    trend: 'up',
    summary: 'Peningkatan cash flow 15%, pengurangan pengeluaran tidak perlu',
  },
  {
    id: '2',
    date: '2025-09-24',
    healthScore: 68,
    trend: 'up',
    summary: 'Stabilitas keuangan meningkat, profit margin bertumbuh',
  },
  {
    id: '3',
    date: '2025-09-17',
    healthScore: 65,
    trend: 'stable',
    summary: 'Kondisi stabil, perhatikan biaya operasional',
  },
];

export default function AnalysisHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Riwayat Analisa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockHistory.map((item, index) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    item.healthScore >= 70
                      ? 'bg-primary/20 text-primary'
                      : item.healthScore >= 40
                        ? 'bg-yellow-500/20 text-yellow-600'
                        : 'bg-destructive/20 text-destructive'
                  }`}
                >
                  {item.healthScore}
                </div>
                {index < mockHistory.length - 1 && (
                  <div className="w-px h-full bg-border mt-2" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {item.trend === 'up' ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Naik
                    </Badge>
                  ) : item.trend === 'down' ? (
                    <Badge variant="destructive">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Turun
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Stabil</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.summary}</p>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Lihat Detail
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mockHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada riwayat analisa</p>
            <p className="text-sm">Lakukan analisa pertama Anda untuk melihat riwayat</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
