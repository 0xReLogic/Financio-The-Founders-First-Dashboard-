import { useState } from 'react';
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

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    id: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon?: string;
  };
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

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Nama kategori tidak boleh kosong',
        variant: 'destructive',
      });
      return;
    }

    // Mock save
    toast({
      title: category ? 'Kategori diperbarui' : 'Kategori ditambahkan',
      description: `${name} berhasil ${category ? 'diperbarui' : 'ditambahkan'}`,
    });

    onOpenChange(false);
    setName('');
    setType('expense');
    setSelectedColor('#65a30d');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input
              id="name"
              placeholder="Contoh: Marketing, Gaji, dll"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-category-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger id="type" data-testid="select-category-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Warna</Label>
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
              <p className="text-sm font-medium">{name || 'Nama Kategori'}</p>
              <p className="text-xs text-muted-foreground">
                {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-category">
            {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
