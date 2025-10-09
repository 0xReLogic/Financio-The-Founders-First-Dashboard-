import { useState, useMemo, useEffect } from 'react';
import { Search, Receipt } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { transactionService, categoryService } from '@/lib/databaseService';
import { createRealtimeSubscription, buildChannels } from '@/lib/realtimeService';
import type { Transaction } from '@shared/types';
import { useToast } from '@/hooks/use-toast';

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch transactions from database
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.list(),
  });

  // Fetch categories from database
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Success!',
        description: 'Transaction deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Failed',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Realtime subscription for live transaction updates
  useEffect(() => {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const transactionsCollectionId = import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS;

    if (!databaseId || !transactionsCollectionId) {
      console.error('Missing database or collection configuration');
      return;
    }

    const unsubscribe = createRealtimeSubscription(
      buildChannels.transactions(databaseId, transactionsCollectionId),
      (response) => {
        console.log('Realtime event on Transactions page:', response);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  // Convert database transactions to UI format
  const uiTransactions = useMemo((): Transaction[] => {
    return transactions.map((t) => {
      const category = categories.find((c) => c.$id === t.category);
      return {
        id: t.$id || '',
        type: t.type,
        amount: t.amount,
        category: category?.name || 'Unknown',
        description: t.description || '',
        date: new Date(t.date),
        receiptUrl: t.receiptId || undefined,
      };
    });
  }, [transactions, categories]);

  const filteredTransactions = uiTransactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory =
      filterCategory === 'all' || 
      categories.find(c => c.name === transaction.category)?.$id === filterCategory;
    
    // Date range filter
    if (dateRange?.from) {
      const transactionDate = transaction.date;
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (transactionDate < fromDate) return false;
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (transactionDate > toDate) return false;
      }
    }
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const isLoading = transactionsLoading || categoriesLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your financial transactions
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
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
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.$id || cat.name} value={cat.$id || ''}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Transactions Yet"
          description={
            searchQuery || filterType !== 'all' || filterCategory !== 'all' || dateRange?.from
              ? 'No transactions match your filters. Try changing your search criteria.'
              : 'No transactions have been recorded yet. Start managing your finances by adding your first transaction.'
          }
          actionLabel="Add Transaction"
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
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled data-testid="button-previous">
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled data-testid="button-next">
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
