import type { MoodEntry } from '../lib/mood';
import { moodLabel } from '../lib/mood';
import {
  formatDayLabel,
  formatLongDayLabel,
  lastNDays,
  todayKey,
} from '../lib/dates';

interface RecentDaysProps {
  entriesByDate: Map<string, MoodEntry>;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export function RecentDays({
  entriesByDate,
  selectedDate,
  onSelectDate,
}: RecentDaysProps) {
  const days = lastNDays(30).reverse();

  return (
    <section className="panel recent-days" aria-labelledby="recent-days-heading">
      <h2 id="recent-days-heading">Last 30 days</h2>
      <p className="section-intro">
        Tap a day to view or edit your entry. Days without a log show a dash.
      </p>
      <ul className="day-list">
        {days.map((dateKey) => {
          const entry = entriesByDate.get(dateKey);
          const isToday = dateKey === todayKey();
          const isSelected = dateKey === selectedDate;
          return (
            <li key={dateKey}>
              <button
                type="button"
                className={`day-list-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectDate(dateKey)}
                aria-current={isSelected ? 'true' : undefined}
              >
                <span className="day-list-date">
                  {isToday ? 'Today' : formatDayLabel(dateKey)}
                  <span className="sr-only">
                    {isToday ? `, ${formatLongDayLabel(dateKey)}` : ''}
                  </span>
                </span>
                <span className="day-list-mood">
                  {entry ? (
                    <>
                      <span className={`mood-pill mood-${entry.mood}`}>
                        {entry.mood}
                      </span>
                      <span>{moodLabel(entry.mood)}</span>
                    </>
                  ) : (
                    <span className="no-entry">No entry</span>
                  )}
                </span>
                {entry?.note && (
                  <span className="day-list-note">{entry.note}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
