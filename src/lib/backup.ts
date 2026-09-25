import type { MoodEntry } from './mood';
import { getAllEntries, replaceAllEntries } from './db';

export const BACKUP_FORMAT_VERSION = 1;
export const PRODUCT_SLUG = 'mood-tracker';

export interface BackupFile {
  formatVersion: number;
  productSlug: string;
  exportedAt: string;
  entries: MoodEntry[];
}

export async function exportBackup(): Promise<BackupFile> {
  const entries = await getAllEntries();
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    productSlug: PRODUCT_SLUG,
    exportedAt: new Date().toISOString(),
    entries,
  };
}

export function downloadBackup(data: BackupFile): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const stamp = data.exportedAt.slice(0, 10);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `cordoval-mood-tracker-backup-${stamp}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseBackupFile(text: string): BackupFile {
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('The file is not valid JSON.');
  }
  const file = parsed as BackupFile;
  if (file.formatVersion !== BACKUP_FORMAT_VERSION) {
    throw new Error(
      `Unsupported backup version (${String(file.formatVersion)}). This app expects version ${BACKUP_FORMAT_VERSION}.`,
    );
  }
  if (file.productSlug !== PRODUCT_SLUG) {
    throw new Error(
      'This file is not a Cordoval Mood Tracker backup.',
    );
  }
  if (!Array.isArray(file.entries)) {
    throw new Error('The backup file is missing entries.');
  }
  for (const entry of file.entries) {
    if (
      !entry ||
      typeof entry.date !== 'string' ||
      typeof entry.mood !== 'number' ||
      typeof entry.updatedAt !== 'string'
    ) {
      throw new Error('The backup contains an invalid entry.');
    }
  }
  return file;
}

export async function importBackup(file: BackupFile): Promise<void> {
  await replaceAllEntries(file.entries);
}
