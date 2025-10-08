import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FileUploadPreview from '@/components/FileUploadPreview';
import { categoryService, transactionService, storageService } from '@/lib/databaseService';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionDialogProps {
  readonly trigger?: React.ReactNode;
}

export default function AddTransactionDialog({ trigger }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories from database
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  // Create transaction mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      type: 'income' | 'expense';
      amount: number;
      category: string;
      description: string;
      date: string;
      receiptId?: string;
    }) => {
      // Upload receipt first if exists
      let receiptId: string | undefined;
      if (receiptFile) {
        try {
          const uploadResult = await storageService.uploadReceipt(receiptFile);
          receiptId = uploadResult.$id;
        } catch (error) {
          console.error('Error uploading receipt:', error);
          throw new Error('Gagal upload bukti transaksi');
        }
      }

      return await transactionService.create({ ...data, receiptId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Berhasil!',
        description: 'Transaksi berhasil ditambahkan',
      });
      setOpen(false);
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setReceiptFile(null);
    },
    onError: (error) => {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Gagal',
        description: error instanceof Error ? error.message : 'Gagal menambahkan transaksi. Silakan coba lagi.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find selected category
    const selectedCategory = categories.find(c => c.$id === category);
    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Kategori tidak valid',
        variant: 'destructive',
      });
      return;
    }

    // Parse amount (remove dots and commas)
    const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Jumlah tidak valid',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      type,
      amount: parsedAmount,
      category: category,
      description,
      date: new Date(date).toISOString(),
    });
  };

  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-add-transaction">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Transaksi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" data-testid="dialog-add-transaction">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe</Label>
            <RadioGroup value={type} onValueChange={(v) => {
              setType(v as 'income' | 'expense');
              setCategory(''); // Reset category when type changes
            }}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" data-testid="radio-income" />
                  <Label htmlFor="income" className="cursor-pointer">
                    Pemasukan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" data-testid="radio-expense" />
                  <Label htmlFor="expense" className="cursor-pointer">
                    Pengeluaran
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah</Label>
            <Input
              id="amount"
              type="text"
              placeholder="1.200.000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory} required disabled={categoriesLoading}>
              <SelectTrigger id="category" data-testid="select-category">
                <SelectValue placeholder={categoriesLoading ? "Memuat..." : "Pilih kategori"} />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <SelectItem key={cat.$id || cat.name} value={cat.$id || ''}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Belum ada kategori {type === 'income' ? 'pemasukan' : 'pengeluaran'}.
                    <br />
                    Buat kategori di halaman Kategori terlebih dahulu.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Supplier invoice untuk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-date"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Bukti Transaksi (Opsional)</Label>
            <FileUploadPreview
              onFileSelect={setReceiptFile}
              accept="image/*,.pdf"
              maxSizeMB={5}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              data-testid="button-cancel"
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              data-testid="button-save"
              disabled={createMutation.isPending || categoriesLoading || !category}
            >
              {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
