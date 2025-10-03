import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: number;
  valueColor?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  valueColor = 'text-foreground',
}: StatsCardProps) {
  return (
    <Card data-testid={`card-stats-${label.toLowerCase()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            {trend !== undefined && (
              <p
                className={`text-xs mt-1 ${trend >= 0 ? 'text-[#65a30d]' : 'text-destructive'}`}
                data-testid={`text-trend-${label.toLowerCase()}`}
              >
                {trend >= 0 ? '+' : ''}
                {trend}% dari bulan lalu
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
