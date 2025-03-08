import { DatabaseService } from './database';

declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    }
  }

  interface Window {
    SyncManager: any;
  }
}

export class SyncService {
  private db: DatabaseService;
  private syncInterval: number = 15 * 60 * 1000; // 15 minutes
  private intervalId?: number;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  async init() {
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-prayer-times');
    }

    // Start periodic sync
    this.startPeriodicSync();

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Initial sync
    if (navigator.onLine) {
      await this.syncData();
    }
  }

  private startPeriodicSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(async () => {
      if (navigator.onLine) {
        await this.syncData();
      }
    }, this.syncInterval);
  }

  private async handleOnline() {
    await this.syncData();
    this.startPeriodicSync();
    
    // Update app state to show online status
    await this.db.setSetting('isOnline', true);
    this.dispatchNetworkStatusEvent(true);
  }

  private async handleOffline() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Update app state to show offline status
    await this.db.setSetting('isOnline', false);
    this.dispatchNetworkStatusEvent(false);
  }

  private dispatchNetworkStatusEvent(isOnline: boolean) {
    window.dispatchEvent(
      new CustomEvent('networkStatus', {
        detail: { isOnline }
      })
    );
  }

  async syncData() {
    try {
      // Sync prayer times
      const response = await fetch('/api/prayer-times');
      if (response.ok) {
        const prayerTimes = await response.json();
        
        // Store each day's prayer times
        for (const [date, times] of Object.entries(prayerTimes)) {
          await this.db.storePrayerTimes(date, times as { [key: string]: string });
        }
      }

      // Sync announcements
      const announcementsResponse = await fetch('/api/announcements');
      if (announcementsResponse.ok) {
        const announcements = await announcementsResponse.json();
        
        // Clear existing announcements and store new ones
        // This assumes we have a method to clear announcements
        for (const announcement of announcements) {
          await this.db.addAnnouncement(announcement);
        }
      }

      // Update last sync time
      await this.db.setSetting('lastSync', Date.now());
      
      // Dispatch sync success event
      window.dispatchEvent(new CustomEvent('syncComplete', {
        detail: { success: true }
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      
      // Dispatch sync error event
      window.dispatchEvent(new CustomEvent('syncComplete', {
        detail: { success: false, error }
      }));
    }
  }

  // Method to force an immediate sync
  async forceSyncData() {
    if (navigator.onLine) {
      await this.syncData();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }

  // Method to get the last sync time
  async getLastSyncTime(): Promise<number | null> {
    return await this.db.getSetting('lastSync');
  }

  // Method to check if we're offline
  async isOffline(): Promise<boolean> {
    const isOnline = await this.db.getSetting('isOnline');
    return isOnline === false;
  }

  // Clean up method
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
} 