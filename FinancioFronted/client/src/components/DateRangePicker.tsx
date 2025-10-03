import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
}

const presets = [
  { label: '7 Hari Terakhir', days: 7 },
  { label: '30 Hari Terakhir', days: 30 },
  { label: '90 Hari Terakhir', days: 90 },
  { label: 'Bulan Ini', days: 'thisMonth' as const },
  { label: 'Bulan Lalu', days: 'lastMonth' as const },
];

export default function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState('30');

  const getDateRange = (preset: string): DateRange => {
    const today = new Date();
    const presetConfig = presets.find((p) => p.days.toString() === preset);

    if (!presetConfig) {
      return {
        from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
        to: today,
      };
    }

    if (presetConfig.days === 'thisMonth') {
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      };
    }

    if (presetConfig.days === 'lastMonth') {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        from: lastMonth,
        to: lastMonthEnd,
      };
    }

    return {
      from: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (presetConfig.days as number)
      ),
      to: today,
    };
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const range = getDateRange(preset);
    onChange?.(range);
  };

  const formatDateRange = (): string => {
    const range = value || getDateRange(selectedPreset);
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    };
    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-2">
          <p className="text-sm font-medium">Pilih Periode</p>
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset, index) => (
                <SelectItem key={index} value={preset.days.toString()}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
