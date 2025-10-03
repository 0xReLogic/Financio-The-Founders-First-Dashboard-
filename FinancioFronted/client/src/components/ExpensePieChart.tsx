import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// todo: remove mock functionality
const mockData = [
  { name: 'Operational', value: 45, color: '#dc2626' },
  { name: 'Marketing', value: 25, color: '#f59e0b' },
  { name: 'Salaries', value: 20, color: '#8b5cf6' },
  { name: 'Others', value: 10, color: '#6b7280' },
];

export default function ExpensePieChart() {
  return (
    <Card data-testid="card-expense-pie-chart">
      <CardHeader>
        <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
