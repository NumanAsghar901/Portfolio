// IndexedDB storage utility for CV PDF files
const DB_NAME = 'PortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'cvFiles';
const CV_KEY = 'uploaded_cv';

function openCvDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredCvRecord {
  blob: Blob;
  name: string;
  size: number;
  type: string;
  updatedAt: string;
}

export async function saveCvFile(file: File): Promise<StoredCvRecord> {
  const db = await openCvDb();
  const record: StoredCvRecord = {
    blob: file,
    name: file.name,
    size: file.size,
    type: file.type || 'application/pdf',
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record, CV_KEY);

    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

export async function getCvFile(): Promise<StoredCvRecord | null> {
  const db = await openCvDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(CV_KEY);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCvFile(): Promise<void> {
  const db = await openCvDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(CV_KEY);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
