import { useState } from 'react';
import {
  ShoppingCart,
  Coffee,
  Zap,
  Home,
  Car,
  Smartphone,
  Users,
  Heart,
  Gift,
  Briefcase,
  Utensils,
  ShoppingBag,
  Plane,
  Music,
  BookOpen,
  Dumbbell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const availableIcons = [
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Coffee', icon: Coffee },
  { name: 'Zap', icon: Zap },
  { name: 'Home', icon: Home },
  { name: 'Car', icon: Car },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Users', icon: Users },
  { name: 'Heart', icon: Heart },
  { name: 'Gift', icon: Gift },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Utensils', icon: Utensils },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Plane', icon: Plane },
  { name: 'Music', icon: Music },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Dumbbell', icon: Dumbbell },
];

interface IconPickerProps {
  value?: string;
  onChange?: (iconName: string) => void;
  color?: string;
}

export default function IconPicker({ value, onChange, color = '#65a30d' }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedIcon = availableIcons.find((i) => i.name === value) || availableIcons[0];
  const SelectedIconComponent = selectedIcon.icon;

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          style={{ borderColor: color }}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <SelectedIconComponent className="w-5 h-5" style={{ color }} />
          </div>
          <span>{selectedIcon.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-2">
            Pilih Icon
          </p>
          <div className="grid grid-cols-4 gap-2">
            {availableIcons.map((item) => {
              const IconComponent = item.icon;
              const isSelected = item.name === value;
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.name)}
                  className={cn(
                    'p-3 rounded-md hover:bg-muted transition-colors',
                    'flex items-center justify-center',
                    isSelected && 'bg-primary/10 ring-2 ring-primary'
                  )}
                  title={item.name}
                >
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: isSelected ? color : undefined }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
