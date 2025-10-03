import { useState, useEffect } from 'react';
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
import { mockCategories } from '@/lib/mockData';
import { Transaction } from '@shared/types';

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

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(transaction.date.toISOString().split('T')[0]);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    const updatedTransaction: Transaction = {
      ...transaction,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
    };

    console.log('Transaction updated:', updatedTransaction);
    onSave(updatedTransaction);
    onOpenChange(false);
  };

  const filteredCategories = mockCategories.filter((cat) => cat.type === type);

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
                  <SelectItem key={cat.id} value={cat.name}>
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
