import { StorageAdapter, StorageOptions } from "@/types/storage";

class ClientLocalStorageAdapter implements StorageAdapter {
  private namespace: string;

  constructor(options?: StorageOptions) {
    this.namespace = options?.namespace ? `${options.namespace}:` : "platform:";
  }

  private getKey(key: string): string {
    return `${this.namespace}${key}`;
  }

  async getItem<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn("ClientLocalStorageAdapter setItem error:", e);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(this.getKey(key));
    } catch (e) {
      console.warn("ClientLocalStorageAdapter removeItem error:", e);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k?.startsWith(this.namespace)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch (e) {
      console.warn("ClientLocalStorageAdapter clear error:", e);
    }
  }
}

export const clientStorage = new ClientLocalStorageAdapter();
