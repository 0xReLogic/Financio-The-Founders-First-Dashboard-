import { useState } from 'react';
import { Search, Receipt } from 'lucide-react';
import TransactionItem from '@/components/TransactionItem';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import EmptyState from '@/components/EmptyState';
import DateRangePicker, { DateRange } from '@/components/DateRangePicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTransactions, mockCategories } from '@/lib/mockData';

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  // Dialog state for adding transactions (dialog component to be implemented)
  const [, setIsAddDialogOpen] = useState(false);

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory =
      filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Transaksi
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua transaksi keuangan Anda
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full sm:w-[280px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-type">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="income">Pemasukan</SelectItem>
              <SelectItem value="expense">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Belum Ada Transaksi"
          description={
            searchQuery || filterType !== 'all' || filterCategory !== 'all'
              ? 'Tidak ada transaksi yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.'
              : 'Belum ada transaksi yang tercatat. Mulai kelola keuangan Anda dengan menambahkan transaksi pertama.'
          }
          actionLabel="Tambah Transaksi"
          onAction={() => setIsAddDialogOpen(true)}
        />
      ) : (
        <>
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={(t) => console.log('Edit:', t)}
                onDelete={(id) => console.log('Delete:', id)}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled data-testid="button-previous">
              Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">Halaman 1 dari 1</span>
            <Button variant="outline" size="sm" disabled data-testid="button-next">
              Selanjutnya
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
