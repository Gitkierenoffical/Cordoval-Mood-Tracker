import type { MoodEntry } from './mood';

const DB_NAME = 'cordoval-mood-tracker';
const DB_VERSION = 1;
const ENTRIES_STORE = 'entries';
const META_STORE = 'meta';

export const META_PERSIST_REQUESTED = 'persistRequested';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
        db.createObjectStore(ENTRIES_STORE, { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    };
  });
}

export async function getAllEntries(): Promise<MoodEntry[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ENTRIES_STORE, 'readonly');
    const store = tx.objectStore(ENTRIES_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const rows = (request.result as MoodEntry[]).sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      resolve(rows);
    };
    tx.oncomplete = () => db.close();
  });
}

export async function getEntry(date: string): Promise<MoodEntry | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ENTRIES_STORE, 'readonly');
    const request = tx.objectStore(ENTRIES_STORE).get(date);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as MoodEntry | undefined);
    tx.oncomplete = () => db.close();
  });
}

export async function putEntry(entry: MoodEntry): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ENTRIES_STORE, 'readwrite');
    const request = tx.objectStore(ENTRIES_STORE).put(entry);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}

export async function deleteEntry(date: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ENTRIES_STORE, 'readwrite');
    const request = tx.objectStore(ENTRIES_STORE).delete(date);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}

export async function replaceAllEntries(entries: MoodEntry[]): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ENTRIES_STORE, 'readwrite');
    const store = tx.objectStore(ENTRIES_STORE);
    const clearReq = store.clear();
    clearReq.onerror = () => reject(clearReq.error);
    clearReq.onsuccess = () => {
      for (const entry of entries) {
        store.put(entry);
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMeta(key: string): Promise<unknown> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const request = tx.objectStore(META_STORE).get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    tx.oncomplete = () => db.close();
  });
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    const request = tx.objectStore(META_STORE).put(value, key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}
