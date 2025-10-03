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
  healthScore: number;
  concerns: string[];
  recommendations: string[];
  analyzedAt: Date;
  usageCount: number;
  usageLimit: number;
}
