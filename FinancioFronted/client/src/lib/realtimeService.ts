import { client } from './appwrite';

export interface RealtimeResponse {
  events: string[];
  channels: string[];
  timestamp: number;
  payload: any;
}

export type RealtimeCallback = (response: RealtimeResponse) => void;

export const createRealtimeSubscription = (
  channels: string[],
  callback: RealtimeCallback
): (() => void) => {
  const unsubscribe = client.subscribe(channels, callback);
  return unsubscribe;
};

export const buildChannels = {
  transactions: (databaseId: string, collectionId: string) => [
    `databases.${databaseId}.collections.${collectionId}.documents`,
  ],
  
  transactionEvents: (databaseId: string, collectionId: string) => [
    `databases.${databaseId}.collections.${collectionId}.documents.*.create`,
    `databases.${databaseId}.collections.${collectionId}.documents.*.update`,
    `databases.${databaseId}.collections.${collectionId}.documents.*.delete`,
  ],
  
  categories: (databaseId: string, collectionId: string) => [
    `databases.${databaseId}.collections.${collectionId}.documents`,
  ],
  
  categoryEvents: (databaseId: string, collectionId: string) => [
    `databases.${databaseId}.collections.${collectionId}.documents.*.create`,
    `databases.${databaseId}.collections.${collectionId}.documents.*.update`,
    `databases.${databaseId}.collections.${collectionId}.documents.*.delete`,
  ],
  
  specificDocument: (databaseId: string, collectionId: string, documentId: string) => [
    `databases.${databaseId}.collections.${collectionId}.documents.${documentId}`,
  ],
};

export const isEventType = (events: string[], eventType: 'create' | 'update' | 'delete'): boolean => {
  return events.some(event => event.includes(`.${eventType}`));
};
