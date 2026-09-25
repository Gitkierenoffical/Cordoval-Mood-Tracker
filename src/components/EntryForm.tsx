import { useState } from 'react';
import type { MoodEntry, MoodScore } from '../lib/mood';
import { MOOD_OPTIONS } from '../lib/mood';
import {
  formatLongDayLabel,
  isFutureDateKey,
  todayKey,
} from '../lib/dates';

interface EntryFormProps {
  dateKey: string;
  entry: MoodEntry | undefined;
  onSave: (entry: MoodEntry) => Promise<void>;
  onDelete: (dateKey: string) => Promise<void>;
  onDateChange: (dateKey: string) => void;
}

export function EntryForm({
  dateKey,
  entry,
  onSave,
  onDelete,
  onDateChange,
}: EntryFormProps) {
  const [mood, setMood] = useState<MoodScore>(entry?.mood ?? 3);
  const [note, setNote] = useState(entry?.note ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFuture = isFutureDateKey(dateKey);
  const isToday = dateKey === todayKey();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isFuture) {
      setError('You cannot log a mood for a future date.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        date: dateKey,
        mood,
        note: note.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!entry) return;
    if (
      !window.confirm(
        `Delete the entry for ${formatLongDayLabel(dateKey)}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      await onDelete(dateKey);
    } catch {
      setError('Could not delete. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel entry-form" aria-labelledby="entry-form-heading" aria-busy={saving}>
      <h2 id="entry-form-heading">
        {isToday ? "Today's mood" : `Mood for ${formatLongDayLabel(dateKey)}`}
      </h2>

      <form onSubmit={(e) => void handleSubmit(e)}>
      <label className="field-label" htmlFor="entry-date">
        Date
      </label>
      <input
        id="entry-date"
        type="date"
        className="date-input"
        value={dateKey}
        max={todayKey()}
        onChange={(e) => onDateChange(e.target.value)}
      />

      <fieldset className="mood-fieldset">
        <legend className="field-label">How do you feel?</legend>
        <div className="mood-options" role="radiogroup" aria-label="Mood score">
          {MOOD_OPTIONS.map((option) => (
            <label
              key={option.score}
              className={`mood-option ${mood === option.score ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="mood"
                value={option.score}
                checked={mood === option.score}
                onChange={() => setMood(option.score)}
              />
              <span className="mood-score">{option.score}</span>
              <span className="mood-label">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field-label" htmlFor="entry-note">
        Note (optional)
      </label>
      <textarea
        id="entry-note"
        className="note-input"
        rows={3}
        maxLength={280}
        placeholder="A few words about your day"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <p className="hint">{note.length}/280 characters</p>

      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="btn primary"
          disabled={saving || isFuture}
        >
          {entry ? 'Save changes' : 'Add entry'}
        </button>
        {entry && (
          <button
            type="button"
            className="btn danger"
            disabled={saving}
            onClick={() => void handleDelete()}
          >
            Delete entry
          </button>
        )}
      </div>
      </form>
    </section>
  );
}
