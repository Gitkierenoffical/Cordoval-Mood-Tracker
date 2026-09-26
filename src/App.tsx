import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppFooter } from './components/AppFooter';
import { BuildHouseDailyAd } from './components/BuildHouseDailyAd';
import { DataPanel } from './components/DataPanel';
import { EntryForm } from './components/EntryForm';
import { RecentDays } from './components/RecentDays';
import { WeekStrip } from './components/WeekStrip';
import { deleteEntry, getAllEntries, putEntry } from './lib/db';
import type { MoodEntry } from './lib/mood';
import { requestPersistentStorageOnce } from './lib/persistStorage';
import { todayKey } from './lib/dates';
import './App.css';

function App() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [loading, setLoading] = useState(true);
  const [persistNotice, setPersistNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const rows = await getAllEntries();
    setEntries(rows);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      await refresh();
      const persistResult = await requestPersistentStorageOnce();
      if (cancelled) return;
      if (persistResult.status === 'denied') {
        setPersistNotice(
          'This browser may clear site data when storage is low. Download a backup regularly so you do not lose your history.',
        );
      }
      setLoading(false);
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, MoodEntry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  const selectedEntry = entriesByDate.get(selectedDate);

  async function handleSave(entry: MoodEntry) {
    await putEntry(entry);
    await refresh();
  }

  async function handleDelete(dateKey: string) {
    await deleteEntry(dateKey);
    await refresh();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <img
          src="/mood-tracker.svg"
          alt=""
          className="app-logo"
          width={40}
          height={40}
        />
        <div>
          <p className="app-brand">Cordoval</p>
          <h1 className="app-title">Mood Tracker</h1>
        </div>
      </header>

      {persistNotice && (
        <div className="persist-notice" role="status">
          {persistNotice}
        </div>
      )}

      {loading ? (
        <p className="loading">Loading your entries…</p>
      ) : (
        <main className="app-main">
          <WeekStrip
            entriesByDate={entriesByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <EntryForm
            key={`${selectedDate}-${selectedEntry?.updatedAt ?? 'new'}`}
            dateKey={selectedDate}
            entry={selectedEntry}
            onSave={handleSave}
            onDelete={handleDelete}
            onDateChange={setSelectedDate}
          />
          <RecentDays
            entriesByDate={entriesByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <DataPanel onDataChanged={refresh} />
        </main>
      )}

      <BuildHouseDailyAd />
      <AppFooter />
    </div>
  );
}

export default App;
