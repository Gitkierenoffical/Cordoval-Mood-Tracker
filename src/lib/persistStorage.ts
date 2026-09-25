import { getMeta, META_PERSIST_REQUESTED, setMeta } from './db';

export type PersistResult =
  | { status: 'granted' }
  | { status: 'denied' }
  | { status: 'unsupported' }
  | { status: 'already_requested' };

export async function requestPersistentStorageOnce(): Promise<PersistResult> {
  const already = await getMeta(META_PERSIST_REQUESTED);
  if (already) {
    return { status: 'already_requested' };
  }

  await setMeta(META_PERSIST_REQUESTED, true);

  if (!navigator.storage?.persist) {
    return { status: 'unsupported' };
  }

  try {
    const granted = await navigator.storage.persist();
    return granted ? { status: 'granted' } : { status: 'denied' };
  } catch {
    return { status: 'denied' };
  }
}
