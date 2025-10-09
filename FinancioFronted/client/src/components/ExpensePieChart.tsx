import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { transactionService, categoryService } from '@/lib/databaseService';
import { getColorHex } from '@/lib/utils';
import { useMemo } from 'react';

export default function ExpensePieChart() {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.list(),
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });

  const isLoading = transactionsLoading || categoriesLoading;

  const chartData = useMemo(() => {
    // Filter expense transactions only
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) return [];

    // Group by category
    const grouped = expenses.reduce((acc, t) => {
      const category = categories.find(c => c.$id === t.category);
      const categoryName = category?.name || 'Unknown';
      const categoryColor = getColorHex(category?.color || 'gray');
      
      if (!acc[categoryName]) {
        acc[categoryName] = { name: categoryName, value: 0, color: categoryColor };
      }
      
      acc[categoryName].value += t.amount;
      
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

    // Convert to array and sort by value (descending)
    return Object.values(grouped).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  return (
    <Card data-testid="card-expense-pie-chart">
      <CardHeader>
        <CardTitle className="text-lg">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">No expense data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const percent = ((value / total) * 100).toFixed(0);
                  return `${name} ${percent}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString('en-US')}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
