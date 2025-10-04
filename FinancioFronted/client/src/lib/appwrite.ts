import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Appwrite Client Configuration
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68dffb6f001231e8a9a2');

// Initialize Appwrite Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export client for advanced usage
export { client };

// Appwrite IDs (will be set after database creation)
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const COLLECTIONS = {
  TRANSACTIONS: import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS || '',
  CATEGORIES: import.meta.env.VITE_APPWRITE_COLLECTION_CATEGORIES || '',
  AI_ANALYSES: import.meta.env.VITE_APPWRITE_COLLECTION_AI_ANALYSES || '',
  RATE_LIMITS: import.meta.env.VITE_APPWRITE_COLLECTION_RATE_LIMITS || '',
};

export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || '';
