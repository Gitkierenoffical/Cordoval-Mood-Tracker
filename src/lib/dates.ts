const formatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const longFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function formatDayLabel(key: string): string {
  return formatter.format(parseDateKey(key));
}

export function formatLongDayLabel(key: string): string {
  return longFormatter.format(parseDateKey(key));
}

export function lastNDays(n: number, end: Date = new Date()): string[] {
  const keys: string[] = [];
  const cursor = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  for (let i = 0; i < n; i++) {
    keys.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return keys.reverse();
}

export function isFutureDateKey(key: string): boolean {
  return key > todayKey();
}
