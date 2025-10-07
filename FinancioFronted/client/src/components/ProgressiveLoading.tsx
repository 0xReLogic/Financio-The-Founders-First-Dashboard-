import { useState, useEffect } from 'react';
import { Database, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressiveLoadingProps {
  onComplete?: () => void;
  duration?: number; // Total duration in ms (default 3000)
}

const steps = [
  {
    icon: Database,
    label: 'Mengumpulkan data transaksi...',
    color: 'text-blue-500',
  },
  {
    icon: Calculator,
    label: 'Menghitung pola keuangan...',
    color: 'text-yellow-500',
  },
  {
    icon: Sparkles,
    label: 'Menganalisa dengan AI...',
    color: 'text-purple-500',
  },
  {
    icon: CheckCircle2,
    label: 'Analisa selesai!',
    color: 'text-[#65a30d]',
  },
];

export default function ProgressiveLoading({
  onComplete,
  duration = 3000,
}: Readonly<ProgressiveLoadingProps>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = duration / steps.length;
    const progressInterval = 50; // Update progress every 50ms

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / duration) * progressInterval;
        const newProgress = Math.min(prev + increment, 100);
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <Card className="border-primary/20">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-3 transition-all duration-300',
                    isActive && 'scale-105',
                    !isActive && !isCompleted && 'opacity-30'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                      isCompleted && 'bg-[#65a30d]/10',
                      isActive && 'bg-primary/10',
                      !isActive && !isCompleted && 'bg-muted'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isCompleted && 'text-[#65a30d]',
                        isActive && step.color,
                        !isActive && !isCompleted && 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium transition-colors',
                        isActive && 'text-foreground',
                        isCompleted && 'text-muted-foreground',
                        !isActive && !isCompleted && 'text-muted-foreground/50'
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-[#65a30d]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% selesai
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
