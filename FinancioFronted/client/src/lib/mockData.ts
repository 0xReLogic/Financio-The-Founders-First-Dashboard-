import { Transaction, Category, StatsData } from '@shared/types';

// todo: remove mock functionality
export const mockCategories: Category[] = [
  { id: '1', name: 'Sales', color: '#65a30d', icon: 'TrendingUp', type: 'income' },
  { id: '2', name: 'Investment', color: '#16a34a', icon: 'DollarSign', type: 'income' },
  { id: '3', name: 'Operational', color: '#dc2626', icon: 'Package', type: 'expense' },
  { id: '4', name: 'Marketing', color: '#f59e0b', icon: 'Megaphone', type: 'expense' },
  { id: '5', name: 'Salaries', color: '#8b5cf6', icon: 'Users', type: 'expense' },
  { id: '6', name: 'Rent', color: '#ec4899', icon: 'Home', type: 'expense' },
];

// todo: remove mock functionality
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 2500000,
    category: 'Sales',
    description: 'Coffee Sales',
    date: new Date(2025, 9, 3, 10, 30),
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200000,
    category: 'Operational',
    description: 'Supplier Invoice',
    date: new Date(2025, 9, 3, 9, 15),
  },
  {
    id: '3',
    type: 'income',
    amount: 3800000,
    category: 'Sales',
    description: 'Catering Service',
    date: new Date(2025, 9, 2),
  },
  {
    id: '4',
    type: 'expense',
    amount: 5000000,
    category: 'Rent',
    description: 'Monthly Rent',
    date: new Date(2025, 9, 1),
  },
  {
    id: '5',
    type: 'expense',
    amount: 800000,
    category: 'Marketing',
    description: 'Instagram Ads',
    date: new Date(2025, 9, 1),
  },
];

// todo: remove mock functionality
export const mockStats: StatsData = {
  income: 50000000,
  expense: 35000000,
  balance: 15000000,
  trend: 25,
};

// Note: Mock AI Analysis removed - now using real database data
// AIAnalysis interface structure: { $id, userId, analysisDate, summary (JSON), advice (markdown), periodDays }

export const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} menit yang lalu`;
    }
    return `${diffHours} jam yang lalu`;
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
