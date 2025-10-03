import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import CashflowChart from '@/components/CashflowChart';
import ExpensePieChart from '@/components/ExpensePieChart';
import AIAdvisorCard from '@/components/AIAdvisorCard';
import TransactionItem from '@/components/TransactionItem';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { mockStats, mockTransactions, mockAIAnalysis, formatCurrency } from '@/lib/mockData';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Ringkasan keuangan bisnis Anda
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={TrendingUp}
          label="Pendapatan"
          value={formatCurrency(mockStats.income)}
          trend={mockStats.trend}
          valueColor="text-[#65a30d]"
        />
        <StatsCard
          icon={TrendingDown}
          label="Pengeluaran"
          value={formatCurrency(mockStats.expense)}
          trend={-12}
          valueColor="text-destructive"
        />
        <StatsCard
          icon={Wallet}
          label="Saldo"
          value={formatCurrency(mockStats.balance)}
          trend={mockStats.trend}
          valueColor="text-[#65a30d]"
        />
        <StatsCard
          icon={Activity}
          label="Trend"
          value={`+${mockStats.trend}%`}
          valueColor="text-[#facc15]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashflowChart />
        <ExpensePieChart />
      </div>

      <AIAdvisorCard
        usageCount={mockAIAnalysis.usageCount}
        usageLimit={mockAIAnalysis.usageLimit}
        onAnalyze={() => setLocation('/advisor')}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
          <Button
            variant="outline"
            onClick={() => setLocation('/transactions')}
            data-testid="button-view-all"
          >
            Lihat Semua
          </Button>
        </div>
        <div className="space-y-2">
          {mockTransactions.slice(0, 4).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={(t) => console.log('Edit:', t)}
              onDelete={(id) => console.log('Delete:', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
