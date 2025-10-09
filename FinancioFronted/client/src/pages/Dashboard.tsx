import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StatsCard from '@/components/StatsCard';
import CashflowChart from '@/components/CashflowChart';
import ExpensePieChart from '@/components/ExpensePieChart';
import AIAdvisorCard from '@/components/AIAdvisorCard';
import TransactionItem from '@/components/TransactionItem';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';
import { transactionService, categoryService } from '@/lib/databaseService';
import { createRealtimeSubscription, buildChannels, isEventType } from '@/lib/realtimeService';
import type { Transaction as UITransaction } from '@shared/types';
import { useLocation } from 'wouter';
import { useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch transactions from database
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.list(),
  });

  // Fetch categories to map categoryId to category name
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

  const isLoading = transactionsLoading || categoriesLoading;

  // Realtime subscription for live dashboard updates
  useEffect(() => {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const transactionsCollectionId = import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS;

    if (!databaseId || !transactionsCollectionId) {
      console.error('Missing database or collection configuration');
      return;
    }

    const unsubscribe = createRealtimeSubscription(
      buildChannels.transactionEvents(databaseId, transactionsCollectionId),
      (response) => {
        console.log('Realtime event on Dashboard:', response);

        // Invalidate queries to trigger refetch
        if (isEventType(response.events, 'create')) {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          toast({
            title: 'New Transaction',
            description: 'Dashboard has been updated with the latest transaction',
          });
        } else if (isEventType(response.events, 'update')) {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        } else if (isEventType(response.events, 'delete')) {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, toast]);

  // Convert database transactions to UI format
  const uiTransactions = useMemo((): UITransaction[] => {
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

  // Calculate stats from real transactions
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;
    
    // Calculate trend (comparing last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    // Income trend
    const last30DaysIncome = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === 'income' && date >= thirtyDaysAgo && date <= now;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previous30DaysIncome = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === 'income' && date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const incomeTrend = previous30DaysIncome > 0
      ? Math.round(((last30DaysIncome - previous30DaysIncome) / previous30DaysIncome) * 100)
      : 0;
    
    // Expense trend
    const last30DaysExpense = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= thirtyDaysAgo && date <= now;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previous30DaysExpense = transactions
      .filter((t) => {
        const date = new Date(t.date);
        return t.type === 'expense' && date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenseTrend = previous30DaysExpense > 0
      ? Math.round(((last30DaysExpense - previous30DaysExpense) / previous30DaysExpense) * 100)
      : 0;
    
    // Balance trend (based on income trend)
    const balanceTrend = incomeTrend;
    
    return { income, expense, balance, incomeTrend, expenseTrend, balanceTrend };
  }, [transactions]);

  // Get recent transactions (last 4)
  const recentTransactions = useMemo(() => {
    return [...uiTransactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 4);
  }, [uiTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            A summary of your business's finances
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={TrendingUp}
              label="Income"
              value={formatCurrency(stats.income)}
              trend={stats.incomeTrend}
              valueColor="text-[#65a30d]"
            />
            <StatsCard
              icon={TrendingDown}
              label="Expense"
              value={formatCurrency(stats.expense)}
              trend={stats.expenseTrend}
              valueColor="text-destructive"
            />
            <StatsCard
              icon={Wallet}
              label="Balance"
              value={formatCurrency(stats.balance)}
              trend={stats.balanceTrend}
              valueColor="text-[#65a30d]"
            />
            <StatsCard
              icon={Activity}
              label="Trend"
              value={`${stats.incomeTrend > 0 ? '+' : ''}${stats.incomeTrend}%`}
              valueColor="text-[#facc15]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CashflowChart />
            <ExpensePieChart />
          </div>

          <AIAdvisorCard
            usageCount={0}
            usageLimit={10}
            onAnalyze={() => setLocation('/advisor')}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <Button
                variant="outline"
                onClick={() => setLocation('/transactions')}
                data-testid="button-view-all"
              >
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={(t) => console.log('Edit:', t)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No transactions yet. Add your first one!
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
