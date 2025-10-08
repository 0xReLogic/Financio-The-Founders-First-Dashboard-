import { databases, account, storage, client, functions } from './appwrite';
import { ID, Query } from 'appwrite';
import { ExecutionMethod } from 'appwrite';

// Collection IDs from environment
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TRANSACTIONS_COLLECTION = import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS;
const CATEGORIES_COLLECTION = import.meta.env.VITE_APPWRITE_COLLECTION_CATEGORIES;
const AI_ANALYSES_COLLECTION = import.meta.env.VITE_APPWRITE_COLLECTION_AI_ANALYSES;
const RATE_LIMITS_COLLECTION = import.meta.env.VITE_APPWRITE_COLLECTION_RATE_LIMITS;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const AI_FUNCTION_ID = import.meta.env.VITE_APPWRITE_FUNCTION_AI_ADVISOR || 'gemini';

// Debug: Log ALL import.meta.env to see what Vite loaded
console.log('🔍 ALL VITE ENV VARS:', import.meta.env);

// Debug: Log environment variables on load
console.log('🔧 Database Service Config:', {
  DATABASE_ID,
  TRANSACTIONS_COLLECTION,
  CATEGORIES_COLLECTION,
  AI_ANALYSES_COLLECTION,
  RATE_LIMITS_COLLECTION,
});

// Validate required env vars
if (!DATABASE_ID || !TRANSACTIONS_COLLECTION || !CATEGORIES_COLLECTION) {
  console.error('❌ Missing required environment variables!');
  console.error('DATABASE_ID:', DATABASE_ID);
  console.error('TRANSACTIONS_COLLECTION:', TRANSACTIONS_COLLECTION);
  console.error('CATEGORIES_COLLECTION:', CATEGORIES_COLLECTION);
  console.error('Please check your .env file in FinancioFronted/ folder and restart the dev server.');
}

// ==================== TYPES ====================

// Helper type aliases for cleaner function signatures
type NewTransaction = Omit<Transaction, '$id' | '$createdAt' | '$updatedAt' | 'userId'>;
type UpdateTransaction = Partial<Omit<Transaction, '$id' | '$createdAt' | '$updatedAt' | 'userId'>>;
type NewCategory = Omit<Category, '$id' | '$createdAt' | '$updatedAt' | 'userId'>;
type UpdateCategory = Partial<Omit<Category, '$id' | '$createdAt' | '$updatedAt' | 'userId'>>;
type NewAIAnalysis = Omit<AIAnalysis, '$id' | '$createdAt' | '$updatedAt' | 'userId'>;

export interface Transaction {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string; // ISO 8601 format
  description?: string;
  receiptId?: string;
}

export interface Category {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface AIAnalysis {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  userId: string;
  analysisDate: string; // ISO 8601 format
  healthScore: number; // 0-100
  concerns: string[];
  recommendations: string[];
}

export interface RateLimit {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  userId: string;
  month: string; // Format: "YYYY-MM"
  aiAnalysisCount: number;
  lastUsed: string; // ISO 8601 format
}

// ==================== TRANSACTIONS ====================

export const transactionService = {
  /**
   * Create a new transaction
   */
  async create(data: NewTransaction) {
    try {
      const user = await account.get();
      const response = await databases.createDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        ID.unique(),
        {
          ...data,
          userId: user.$id,
        },
        [
          `read("user:${user.$id}")`,
          `update("user:${user.$id}")`,
          `delete("user:${user.$id}")`,
        ]
      );
      return response as unknown as Transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  /**
   * Get all transactions for the current user
   */
  async list(queries: string[] = []) {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        [Query.equal('userId', user.$id), ...queries]
      );
      return response.documents as unknown as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Get a single transaction by ID
   */
  async get(transactionId: string) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        transactionId
      );
      return response as unknown as Transaction;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  /**
   * Update a transaction
   */
  async update(transactionId: string, data: UpdateTransaction) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        transactionId,
        data
      );
      return response as unknown as Transaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  /**
   * Delete a transaction
   */
  async delete(transactionId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        transactionId
      );
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  /**
   * Get transactions by date range
   */
  async getByDateRange(startDate: string, endDate: string) {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        [
          Query.equal('userId', user.$id),
          Query.greaterThanEqual('date', startDate),
          Query.lessThanEqual('date', endDate),
          Query.orderDesc('date'),
        ]
      );
      return response.documents as unknown as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  },

  /**
   * Get transactions by category
   */
  async getByCategory(categoryName: string) {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION,
        [
          Query.equal('userId', user.$id),
          Query.equal('category', categoryName),
          Query.orderDesc('date'),
        ]
      );
      return response.documents as unknown as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by category:', error);
      throw error;
    }
  },
};

// ==================== CATEGORIES ====================

export const categoryService = {
  /**
   * Create a new category
   */
  async create(data: NewCategory) {
    try {
      const user = await account.get();
      const response = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION,
        ID.unique(),
        {
          ...data,
          userId: user.$id,
        },
        [
          `read("user:${user.$id}")`,
          `update("user:${user.$id}")`,
          `delete("user:${user.$id}")`,
        ]
      );
      return response as unknown as Category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Get all categories for the current user
   */
  async list() {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION,
        [Query.equal('userId', user.$id), Query.orderAsc('name')]
      );
      return response.documents as unknown as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a single category by ID
   */
  async get(categoryId: string) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION,
        categoryId
      );
      return response as unknown as Category;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Update a category
   */
  async update(categoryId: string, data: UpdateCategory) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION,
        categoryId,
        data
      );
      return response as unknown as Category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete a category
   */
  async delete(categoryId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION,
        categoryId
      );
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  /**
   * Get categories by type (income/expense)
   */
  async getByType(type: 'income' | 'expense') {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION,
        [
          Query.equal('userId', user.$id),
          Query.equal('type', type),
          Query.orderAsc('name'),
        ]
      );
      return response.documents as unknown as Category[];
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      throw error;
    }
  },
};

// ==================== AI ANALYSES ====================

export const aiAnalysisService = {
  /**
   * Create a new AI analysis
   */
  async create(data: NewAIAnalysis) {
    try {
      const user = await account.get();
      const response = await databases.createDocument(
        DATABASE_ID,
        AI_ANALYSES_COLLECTION,
        ID.unique(),
        {
          ...data,
          userId: user.$id,
        },
        [
          `read("user:${user.$id}")`,
          `update("user:${user.$id}")`,
          `delete("user:${user.$id}")`,
        ]
      );
      return response as unknown as AIAnalysis;
    } catch (error) {
      console.error('Error creating AI analysis:', error);
      throw error;
    }
  },

  /**
   * Get all AI analyses for the current user
   */
  async list() {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        AI_ANALYSES_COLLECTION,
        [Query.equal('userId', user.$id), Query.orderDesc('analysisDate')]
      );
      return response.documents as unknown as AIAnalysis[];
    } catch (error) {
      console.error('Error fetching AI analyses:', error);
      throw error;
    }
  },

  /**
   * Get a single AI analysis by ID
   */
  async get(analysisId: string) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        AI_ANALYSES_COLLECTION,
        analysisId
      );
      return response as unknown as AIAnalysis;
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      throw error;
    }
  },

  /**
   * Get the latest AI analysis
   */
  async getLatest() {
    try {
      const user = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        AI_ANALYSES_COLLECTION,
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('analysisDate'),
          Query.limit(1),
        ]
      );
      return response.documents.length > 0 ? (response.documents[0] as unknown as AIAnalysis) : null;
    } catch (error) {
      console.error('Error fetching latest AI analysis:', error);
      throw error;
    }
  },

  /**
   * Delete an AI analysis
   */
  async delete(analysisId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        AI_ANALYSES_COLLECTION,
        analysisId
      );
      return true;
    } catch (error) {
      console.error('Error deleting AI analysis:', error);
      throw error;
    }
  },
};

// ==================== RATE LIMITS ====================

export const rateLimitService = {
  /**
   * Get or create rate limit for current user and month
   */
  async getOrCreate(month: string) {
    try {
      const user = await account.get();
      
      // Try to find existing rate limit for this month
      const response = await databases.listDocuments(
        DATABASE_ID,
        RATE_LIMITS_COLLECTION,
        [
          Query.equal('userId', user.$id),
          Query.equal('month', month),
        ]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as RateLimit;
      }

      // Create new rate limit if not exists
      const newRateLimit = await databases.createDocument(
        DATABASE_ID,
        RATE_LIMITS_COLLECTION,
        ID.unique(),
        {
          userId: user.$id,
          month,
          aiAnalysisCount: 0,
          lastUsed: new Date().toISOString(),
        },
        [
          `read("user:${user.$id}")`,
          `update("user:${user.$id}")`,
          `delete("user:${user.$id}")`,
        ]
      );

      return newRateLimit as unknown as RateLimit;
    } catch (error) {
      console.error('Error getting or creating rate limit:', error);
      throw error;
    }
  },

  /**
   * Increment AI analysis count
   */
  async incrementAnalysisCount(month: string) {
    try {
      const rateLimit = await this.getOrCreate(month);
      
      const updated = await databases.updateDocument(
        DATABASE_ID,
        RATE_LIMITS_COLLECTION,
        rateLimit.$id!,
        {
          aiAnalysisCount: rateLimit.aiAnalysisCount + 1,
          lastUsed: new Date().toISOString(),
        }
      );

      return updated as unknown as RateLimit;
    } catch (error) {
      console.error('Error incrementing analysis count:', error);
      throw error;
    }
  },

  /**
   * Check if user has exceeded rate limit
   */
  async hasExceededLimit(month: string, maxLimit: number = 10) {
    try {
      const rateLimit = await this.getOrCreate(month);
      return rateLimit.aiAnalysisCount >= maxLimit;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      throw error;
    }
  },

  /**
   * Get remaining analyses for the month
   */
  async getRemainingAnalyses(month: string, maxLimit: number = 10) {
    try {
      const rateLimit = await this.getOrCreate(month);
      return Math.max(0, maxLimit - rateLimit.aiAnalysisCount);
    } catch (error) {
      console.error('Error getting remaining analyses:', error);
      throw error;
    }
  },
};

// ==================== STORAGE (RECEIPTS) ====================

export const storageService = {
  /**
   * Upload a receipt file
   */
  async uploadReceipt(file: File) {
    try {
      const user = await account.get();
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        [
          `read("user:${user.$id}")`,
          `update("user:${user.$id}")`,
          `delete("user:${user.$id}")`,
        ]
      );
      return response;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      throw error;
    }
  },

  /**
   * Delete a receipt file
   */
  async deleteReceipt(fileId: string) {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error) {
      console.error('Error deleting receipt:', error);
      throw error;
    }
  },

  /**
   * Get receipt file URL for preview
   * Using direct URL construction for better compatibility
   */
  getFileUrl(fileId: string) {
    try {
      // Build URL manually to ensure proper format
      // Format: {endpoint}/storage/buckets/{bucketId}/files/{fileId}/view?project={projectId}
      return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  /**
   * Get receipt file download URL
   */
  getFileDownload(fileId: string) {
    try {
      // Format: {endpoint}/storage/buckets/{bucketId}/files/{fileId}/download?project={projectId}
      return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileId}/download?project=${APPWRITE_PROJECT_ID}`;
    } catch (error) {
      console.error('Error getting file download URL:', error);
      throw error;
    }
  },
};

// ==================== AI FUNCTION SERVICE ====================

export const aiFunctionService = {
  /**
   * Execute AI financial analysis
   */
  async executeAnalysis(userId: string) {
    try {
      const execution = await functions.createExecution(
        AI_FUNCTION_ID,
        JSON.stringify({ userId }),
        false, // async = false (wait for response)
        '/',
        ExecutionMethod.POST,
        { 'Content-Type': 'application/json' }
      );

      // Parse response
      if (execution.responseStatusCode === 200) {
        const response = JSON.parse(execution.responseBody);
        return response;
      } else {
        const error = JSON.parse(execution.responseBody);
        throw new Error(error.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error executing AI analysis:', error);
      throw error;
    }
  },

  /**
   * Get user credits info
   */
  async getCredits(userId: string) {
    try {
      const rateLimit = await databases.getDocument(
        DATABASE_ID,
        RATE_LIMITS_COLLECTION,
        userId
      );
      
      return {
        totalCredits: rateLimit.totalCredits || 10,
        usedCredits: rateLimit.usedCredits || 0,
        remainingCredits: (rateLimit.totalCredits || 10) - (rateLimit.usedCredits || 0),
        isPaid: rateLimit.isPaid || false,
        lastUsedAt: rateLimit.lastUsedAt
      };
    } catch (error: any) {
      // If document doesn't exist, create it with free tier credits
      if (error.code === 404) {
        try {
          const newRateLimit = await databases.createDocument(
            DATABASE_ID,
            RATE_LIMITS_COLLECTION,
            userId,
            {
              userId: userId,
              totalCredits: 10,
              usedCredits: 0,
              isPaid: false,
              lastUsedAt: null
            }
          );
          
          return {
            totalCredits: 10,
            usedCredits: 0,
            remainingCredits: 10,
            isPaid: false,
            lastUsedAt: null
          };
        } catch (createError) {
          console.error('Error creating rate limit document:', createError);
          throw createError;
        }
      }
      console.error('Error getting credits:', error);
      throw error;
    }
  }
};

// Export all services
export const databaseService = {
  transactions: transactionService,
  categories: categoryService,
  aiAnalyses: aiAnalysisService,
  rateLimits: rateLimitService,
  storage: storageService,
  aiFunction: aiFunctionService,
};
