import { DatabaseService } from './database';
import { SyncService } from './sync';

// Initialize database service
const db = new DatabaseService();

// Initialize sync service with database
const sync = new SyncService(db);

// Initialize services
export const initializeServices = async () => {
  await db.initDatabase();
  await sync.init();
};

export { db, sync }; 