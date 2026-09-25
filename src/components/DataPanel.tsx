import { useRef, useState } from 'react';
import {
  downloadBackup,
  exportBackup,
  importBackup,
  parseBackupFile,
} from '../lib/backup';

interface DataPanelProps {
  onDataChanged: () => Promise<void>;
}

export function DataPanel({ onDataChanged }: DataPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleBackup() {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const data = await exportBackup();
      downloadBackup(data);
      setMessage('Backup downloaded. Keep this file somewhere safe.');
    } catch {
      setError('Could not create a backup. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleFilePicked(file: File) {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const text = await file.text();
      const backup = parseBackupFile(text);
      const count = backup.entries.length;
      const confirmed = window.confirm(
        `Replace all entries on this device with ${count} ${count === 1 ? 'entry' : 'entries'} from the backup? This cannot be undone.`,
      );
      if (!confirmed) {
        setMessage('Load cancelled. Your current entries are unchanged.');
        return;
      }
      await importBackup(backup);
      await onDataChanged();
      setMessage(`Loaded ${count} ${count === 1 ? 'entry' : 'entries'} from your backup file.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the file.');
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <section className="panel data-panel" aria-labelledby="data-panel-heading">
      <h2 id="data-panel-heading">Your data</h2>
      <p className="section-intro">
        Entries stay in your browser only. Download a backup file to move your
        history to another device. The file never leaves your device unless you
        choose to copy it elsewhere.
      </p>
      <div className="data-actions">
        <button
          type="button"
          className="btn secondary"
          disabled={busy}
          onClick={handleBackup}
        >
          Download backup
        </button>
        <button
          type="button"
          className="btn secondary"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
        >
          Load from file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFilePicked(file);
          }}
        />
      </div>
      {message && (
        <p className="info-banner" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
