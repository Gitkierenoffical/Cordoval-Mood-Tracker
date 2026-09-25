import type { MoodEntry } from '../lib/mood';
import { moodLabel } from '../lib/mood';
import { formatDayLabel, lastNDays, todayKey } from '../lib/dates';

interface WeekStripProps {
  entriesByDate: Map<string, MoodEntry>;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export function WeekStrip({
  entriesByDate,
  selectedDate,
  onSelectDate,
}: WeekStripProps) {
  const days = lastNDays(7);

  return (
    <section className="panel week-strip" aria-labelledby="week-strip-heading">
      <h2 id="week-strip-heading">Last 7 days</h2>
      <div className="week-strip-row" role="list">
        {days.map((dateKey) => {
          const entry = entriesByDate.get(dateKey);
          const isToday = dateKey === todayKey();
          const isSelected = dateKey === selectedDate;
          return (
            <button
              key={dateKey}
              type="button"
              role="listitem"
              className={`week-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onSelectDate(dateKey)}
              aria-label={
                entry
                  ? `${formatDayLabel(dateKey)}, ${moodLabel(entry.mood)}`
                  : `${formatDayLabel(dateKey)}, no entry`
              }
              aria-current={isSelected ? 'date' : undefined}
            >
              <span className="week-day-label">{formatDayLabel(dateKey)}</span>
              <span
                className={`week-day-mood ${entry ? `mood-${entry.mood}` : 'empty'}`}
                aria-hidden
              >
                {entry ? entry.mood : '·'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
