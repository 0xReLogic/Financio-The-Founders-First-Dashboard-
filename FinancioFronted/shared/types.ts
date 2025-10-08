export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  receiptUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

export interface StatsData {
  income: number;
  expense: number;
  balance: number;
  trend: number;
}

export interface AIAnalysis {
  $id: string;
  userId: string;
  analysisDate: string;
  summary: string; // JSON string containing total_income, total_expense, net_balance, expense_breakdown
  advice: string; // Markdown formatted AI advice
  periodDays: number;
  $createdAt?: string;
  $updatedAt?: string;
}
