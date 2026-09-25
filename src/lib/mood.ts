export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  date: string;
  mood: MoodScore;
  note?: string;
  updatedAt: string;
}

export const MOOD_OPTIONS: { score: MoodScore; label: string }[] = [
  { score: 1, label: 'Very low' },
  { score: 2, label: 'Low' },
  { score: 3, label: 'Okay' },
  { score: 4, label: 'Good' },
  { score: 5, label: 'Great' },
];

export function moodLabel(score: MoodScore): string {
  return MOOD_OPTIONS.find((o) => o.score === score)?.label ?? 'Unknown';
}

export function moodShortLabel(score: MoodScore): string {
  return String(score);
}
