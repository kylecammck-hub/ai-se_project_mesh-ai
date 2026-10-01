// Simple in-memory cache with a time-to-live (TTL) per entry.
interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 60 * 1000;
const store = new Map<string, CacheEntry>();

export const getCacheValue = <T>(key: string): T | undefined => {
  const entry = store.get(key);
  if (!entry) return undefined;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  return entry.value as T;
};

export const setCacheValue = (key: string, value: unknown, ttlMs: number = DEFAULT_TTL_MS): void => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
};

export const deleteCacheValue = (key: string): void => {
  store.delete(key);
};
