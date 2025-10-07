/**
 * Seed Script for Default Categories
 * 
 * This script creates default income and expense categories for new users.
 * Run this after user registration to populate default categories.
 */

import { categoryService, type Category } from '../lib/databaseService';

// Default Income Categories
const defaultIncomeCategories: Omit<Category, '$id' | '$createdAt' | '$updatedAt' | 'userId'>[] = [
  {
    name: 'Sales Revenue',
    type: 'income',
    color: 'green',
    icon: 'TrendingUp',
  },
  {
    name: 'Service Income',
    type: 'income',
    color: 'emerald',
    icon: 'Briefcase',
  },
  {
    name: 'Investment Returns',
    type: 'income',
    color: 'lime',
    icon: 'PiggyBank',
  },
  {
    name: 'Grant/Funding',
    type: 'income',
    color: 'teal',
    icon: 'Award',
  },
  {
    name: 'Other Income',
    type: 'income',
    color: 'cyan',
    icon: 'DollarSign',
  },
];

// Default Expense Categories
const defaultExpenseCategories: Omit<Category, '$id' | '$createdAt' | '$updatedAt' | 'userId'>[] = [
  {
    name: 'Salary & Wages',
    type: 'expense',
    color: 'red',
    icon: 'Users',
  },
  {
    name: 'Marketing & Ads',
    type: 'expense',
    color: 'orange',
    icon: 'Megaphone',
  },
  {
    name: 'Software & Tools',
    type: 'expense',
    color: 'purple',
    icon: 'Code',
  },
  {
    name: 'Office Rent',
    type: 'expense',
    color: 'pink',
    icon: 'Building',
  },
  {
    name: 'Utilities',
    type: 'expense',
    color: 'yellow',
    icon: 'Zap',
  },
  {
    name: 'Transportation',
    type: 'expense',
    color: 'blue',
    icon: 'Car',
  },
  {
    name: 'Legal & Accounting',
    type: 'expense',
    color: 'indigo',
    icon: 'Scale',
  },
  {
    name: 'Inventory',
    type: 'expense',
    color: 'amber',
    icon: 'Package',
  },
  {
    name: 'Insurance',
    type: 'expense',
    color: 'rose',
    icon: 'Shield',
  },
  {
    name: 'Other Expenses',
    type: 'expense',
    color: 'gray',
    icon: 'MoreHorizontal',
  },
];

/**
 * Seed default categories for the current user
 */
export async function seedDefaultCategories() {
  try {
    console.log('🌱 Seeding default categories...');

    // Create all income categories
    const incomePromises = defaultIncomeCategories.map((category) =>
      categoryService.create(category)
    );
    const incomeCategories = await Promise.all(incomePromises);
    console.log(`✅ Created ${incomeCategories.length} income categories`);

    // Create all expense categories
    const expensePromises = defaultExpenseCategories.map((category) =>
      categoryService.create(category)
    );
    const expenseCategories = await Promise.all(expensePromises);
    console.log(`✅ Created ${expenseCategories.length} expense categories`);

    console.log('✅ Default categories seeded successfully!');
    return {
      income: incomeCategories,
      expense: expenseCategories,
    };
  } catch (error) {
    console.error('❌ Error seeding default categories:', error);
    throw error;
  }
}

/**
 * Check if user has any categories
 */
export async function hasCategories(): Promise<boolean> {
  try {
    const categories = await categoryService.list();
    return categories.length > 0;
  } catch (error) {
    console.error('Error checking categories:', error);
    return false;
  }
}

/**
 * Seed categories if user doesn't have any
 */
export async function seedIfEmpty() {
  try {
    const hasCats = await hasCategories();
    if (!hasCats) {
      console.log('No categories found, seeding defaults...');
      return await seedDefaultCategories();
    } else {
      console.log('Categories already exist, skipping seed.');
      return null;
    }
  } catch (error) {
    console.error('Error in seedIfEmpty:', error);
    throw error;
  }
}
