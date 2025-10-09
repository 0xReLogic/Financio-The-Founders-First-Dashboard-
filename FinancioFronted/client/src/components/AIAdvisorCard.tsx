import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIAdvisorCardProps {
  usageCount: number;
  usageLimit: number;
  onAnalyze: () => void;
}

export default function AIAdvisorCard({ usageCount, usageLimit, onAnalyze }: AIAdvisorCardProps) {
  return (
    <Card className="bg-gradient-to-r from-[#65a30d]/10 to-[#facc15]/10 border-primary/20" data-testid="card-ai-advisor">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">AI Financial Advisor</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Get instant business insights from our AI
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-usage-count">
              Usage: {usageCount}/{usageLimit} this month
            </p>
          </div>
          <Button onClick={onAnalyze} size="lg" data-testid="button-get-advice">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
