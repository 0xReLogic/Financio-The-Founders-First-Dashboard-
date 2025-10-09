import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import IconPicker from '@/components/IconPicker';
import { useToast } from '@/hooks/use-toast';
import { categoryService, type Category } from '@/lib/databaseService';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

const PRESET_COLORS = [
  { name: 'Green', value: '#65a30d' },
  { name: 'Yellow', value: '#facc15' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Indigo', value: '#6366f1' },
];

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
}: Readonly<CategoryDialogProps>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(category?.name || '');
  const [type, setType] = useState<'income' | 'expense'>(
    category?.type || 'expense'
  );
  const [selectedColor, setSelectedColor] = useState(
    category?.color || '#65a30d'
  );
  const [selectedIcon, setSelectedIcon] = useState(
    category?.icon || 'ShoppingCart'
  );

  // Update form when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
    } else {
      setName('');
      setType('expense');
      setSelectedColor('#65a30d');
      setSelectedIcon('ShoppingCart');
    }
  }, [category]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Category Added',
        description: `${name} has been added successfully`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Create category error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Category Updated',
        description: `${name} has been updated successfully`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Update category error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    // Prevent multiple submissions
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    const categoryData = {
      name: name.trim(),
      type,
      color: selectedColor,
      icon: selectedIcon,
    };

    if (category?.$id) {
      // Update existing category
      updateMutation.mutate({
        id: category.$id,
        data: categoryData,
      });
    } else {
      // Create new category
      createMutation.mutate(categoryData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onKeyDown={(e) => {
        if (e.key === 'Enter' && !createMutation.isPending && !updateMutation.isPending) {
          e.preventDefault();
          handleSubmit();
        }
      }}>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g., Marketing, Salary, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-category-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger id="type" data-testid="select-category-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-md border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-primary scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  data-testid={`color-${color.value}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <IconPicker
              value={selectedIcon}
              onChange={setSelectedIcon}
              color={selectedColor}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <div
              className="w-8 h-8 rounded-md"
              style={{ backgroundColor: selectedColor }}
            />
            <div>
              <p className="text-sm font-medium">{name || 'Category Name'}</p>
              <p className="text-xs text-muted-foreground">
                {type === 'income' ? 'Income' : 'Expense'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createMutation.isPending || updateMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            data-testid="button-save-category"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending 
              ? 'Saving...' 
              : category ? 'Save Changes' : 'Add Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
