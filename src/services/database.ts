import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MasjidDB extends DBSchema {
  prayerTimes: {
    key: string;
    value: {
      date: string;
      times: {
        [key: string]: string;
      };
      lastUpdated: number;
    };
  };
  settings: {
    key: string;
    value: any;
  };
  announcements: {
    key: number;
    value: {
      id: number;
      text: string;
      startDate: string;
      endDate: string;
      priority: number;
    };
    indexes: {
      'by-date': [string, string];
    };
  };
}

const DB_NAME = 'masjid-screen-db';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBPDatabase<MasjidDB> | null = null;

  async initDatabase() {
    try {
      this.db = await openDB<MasjidDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Prayer times store
          if (!db.objectStoreNames.contains('prayerTimes')) {
            db.createObjectStore('prayerTimes', { keyPath: 'date' });
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }

          // Announcements store
          if (!db.objectStoreNames.contains('announcements')) {
            const announcementsStore = db.createObjectStore('announcements', { 
              keyPath: 'id',
              autoIncrement: true 
            });
            announcementsStore.createIndex('by-date', ['startDate', 'endDate']);
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  private async ensureConnection() {
    if (!this.db) {
      await this.initDatabase();
    }
    if (!this.db) {
      throw new Error('Database connection failed');
    }
  }

  async storePrayerTimes(date: string, times: { [key: string]: string }) {
    try {
      await this.ensureConnection();
      await this.db!.put('prayerTimes', {
        date,
        times,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Failed to store prayer times:', error);
      throw new Error('Failed to store prayer times');
    }
  }

  async getPrayerTimes(date: string) {
    try {
      await this.ensureConnection();
      return await this.db!.get('prayerTimes', date);
    } catch (error) {
      console.error('Failed to get prayer times:', error);
      throw new Error('Failed to get prayer times');
    }
  }

  async getAllPrayerTimes() {
    try {
      await this.ensureConnection();
      return await this.db!.getAll('prayerTimes');
    } catch (error) {
      console.error('Failed to get all prayer times:', error);
      throw new Error('Failed to get all prayer times');
    }
  }

  async setSetting(key: string, value: any) {
    try {
      await this.ensureConnection();
      await this.db!.put('settings', { key, value });
    } catch (error) {
      console.error('Failed to set setting:', error);
      throw new Error('Failed to set setting');
    }
  }

  async getSetting(key: string) {
    try {
      await this.ensureConnection();
      const result = await this.db!.get('settings', key);
      return result?.value;
    } catch (error) {
      console.error('Failed to get setting:', error);
      throw new Error('Failed to get setting');
    }
  }

  async addAnnouncement(announcement: Omit<MasjidDB['announcements']['value'], 'id'>) {
    try {
      await this.ensureConnection();
      return await this.db!.add('announcements', announcement as any);
    } catch (error) {
      console.error('Failed to add announcement:', error);
      throw new Error('Failed to add announcement');
    }
  }

  async getActiveAnnouncements() {
    try {
      await this.ensureConnection();
      const now = new Date().toISOString();
      const tx = this.db!.transaction('announcements', 'readonly');
      const index = tx.store.index('by-date');
      
      return await index.getAll(IDBKeyRange.bound(
        [now], // startDate less than or equal to now
        [now]  // endDate greater than or equal to now
      ));
    } catch (error) {
      console.error('Failed to get active announcements:', error);
      throw new Error('Failed to get active announcements');
    }
  }

  async deleteAnnouncement(id: number) {
    try {
      await this.ensureConnection();
      await this.db!.delete('announcements', id);
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      throw new Error('Failed to delete announcement');
    }
  }

  async clearAnnouncements() {
    try {
      await this.ensureConnection();
      const tx = this.db!.transaction('announcements', 'readwrite');
      await tx.store.clear();
    } catch (error) {
      console.error('Failed to clear announcements:', error);
      throw new Error('Failed to clear announcements');
    }
  }
} 