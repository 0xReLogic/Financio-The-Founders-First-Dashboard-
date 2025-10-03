import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// todo: remove mock functionality
const mockData = [
  { day: '1 Oct', income: 3000000, expense: 2000000 },
  { day: '5 Oct', income: 4500000, expense: 2500000 },
  { day: '10 Oct', income: 3800000, expense: 3200000 },
  { day: '15 Oct', income: 5200000, expense: 2800000 },
  { day: '20 Oct', income: 4100000, expense: 3500000 },
  { day: '25 Oct', income: 5800000, expense: 3000000 },
  { day: '30 Oct', income: 6200000, expense: 3300000 },
];

export default function CashflowChart() {
  return (
    <Card data-testid="card-cashflow-chart">
      <CardHeader>
        <CardTitle className="text-lg">Cash Flow (30 Hari)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
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
      </CardContent>
    </Card>
  );
}
