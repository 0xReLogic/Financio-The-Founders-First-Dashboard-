import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/lib/databaseService';
import { useMemo } from 'react';

export default function CashflowChart() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.list(),
  });

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];

    // Get last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter transactions from last 30 days
    const recentTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= thirtyDaysAgo && txDate <= now;
    });

    // Group by date (DD MMM format)
    const groupedByDate = recentTransactions.reduce((acc, t) => {
      const date = new Date(t.date);
      const key = `${date.getDate()} ${date.toLocaleDateString('id-ID', { month: 'short' })}`;
      
      if (!acc[key]) {
        acc[key] = { day: key, income: 0, expense: 0, date: date.getTime() };
      }
      
      if (t.type === 'income') {
        acc[key].income += t.amount;
      } else {
        acc[key].expense += t.amount;
      }
      
      return acc;
    }, {} as Record<string, { day: string; income: number; expense: number; date: number }>);

    // Convert to array and sort by date
    return Object.values(groupedByDate)
      .sort((a, b) => a.date - b.date)
      .map(({ day, income, expense }) => ({ day, income, expense }));
  }, [transactions]);

  return (
    <Card data-testid="card-cashflow-chart">
      <CardHeader>
        <CardTitle className="text-lg">Cash Flow (30 Hari)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">Belum ada data transaksi dalam 30 hari terakhir</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#65a30d"
                strokeWidth={2}
                dot={{ fill: '#65a30d' }}
                name="Pemasukan"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ fill: '#dc2626' }}
                name="Pengeluaran"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
