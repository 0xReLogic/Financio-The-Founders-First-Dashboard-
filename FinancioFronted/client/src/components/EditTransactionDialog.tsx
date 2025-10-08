import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Transaction } from '@shared/types';
import { useToast } from '@/hooks/use-toast';

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: Transaction) => void;
}

export default function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
  onSave,
}: EditTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [currentReceiptId, setCurrentReceiptId] = useState<string | undefined>();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories from database
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  // Update transaction mutation
  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      type: 'income' | 'expense';
      amount: number;
      category: string;
      description: string;
      date: string;
      receiptId?: string;
    }) => {
      const { id, ...updateData } = data;
      
      // Handle receipt upload/delete
      let receiptId = currentReceiptId;
      
      // If new receipt file uploaded
      if (receiptFile) {
        try {
          // Delete old receipt if exists
          if (currentReceiptId) {
            await storageService.deleteReceipt(currentReceiptId);
          }
          // Upload new receipt
          const uploadResult = await storageService.uploadReceipt(receiptFile);
          receiptId = uploadResult.$id;
        } catch (error) {
          console.error('Error handling receipt:', error);
          throw new Error('Gagal mengupdate bukti transaksi');
        }
      }
      
      return await transactionService.update(id, { ...updateData, receiptId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Berhasil!',
        description: 'Transaksi berhasil diupdate',
      });
      setReceiptFile(null);
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Gagal',
        description: error instanceof Error ? error.message : 'Gagal mengupdate transaksi. Silakan coba lagi.',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      // Find category ID from name
      const cat = categories.find(c => c.name === transaction.category);
      setCategory(cat?.$id || '');
      setDescription(transaction.description);
      setDate(transaction.date.toISOString().split('T')[0]);
      setCurrentReceiptId(transaction.receiptUrl);
      setReceiptFile(null);
    }
  }, [transaction, categories]);

  // Reset category when type changes
  useEffect(() => {
    if (category) {
      const currentCategory = categories.find(c => c.$id === category);
      if (currentCategory && currentCategory.type !== type) {
        setCategory('');
      }
    }
  }, [type, category, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

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

    updateMutation.mutate({
      id: transaction.id,
      type,
      amount: parsedAmount,
      category: category,
      description,
      date: new Date(date).toISOString(),
    });
  };

  const filteredCategories = categories.filter((cat) => cat.type === type);

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-edit-transaction">
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="edit-income" data-testid="radio-income" />
                  <Label htmlFor="edit-income" className="cursor-pointer">
                    Pemasukan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="edit-expense" data-testid="radio-expense" />
                  <Label htmlFor="edit-expense" className="cursor-pointer">
                    Pengeluaran
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Jumlah</Label>
            <Input
              id="edit-amount"
              type="text"
              placeholder="1.200.000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="input-amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Kategori</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="edit-category" data-testid="select-category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.$id} value={cat.$id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Deskripsi</Label>
            <Textarea
              id="edit-description"
              placeholder="Supplier invoice untuk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">Tanggal</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-date"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Bukti Transaksi (Opsional)</Label>
            {currentReceiptId && !receiptFile && (
              <div className="text-sm text-muted-foreground mb-2">
                <a 
                  href={storageService.getFileUrl(currentReceiptId)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Lihat bukti saat ini
                </a>
              </div>
            )}
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
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Batal
            </Button>
            <Button type="submit" data-testid="button-save">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
