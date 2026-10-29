// The first day shown in the log.
export const startDate = '2026-10-29'

export type Habit = { id: string, label: string, from?: string, until?: string }

// The daily habits. Days only show the habits that were active on them, so the routine can change over time:
// - add a habit with `from` set to its first day, so older days don't show it as missed
// - retire a habit by setting `until` to its last day instead of deleting it, so older days keep it
// Keep ids stable: the log stores ids, so renaming a label is safe.
export const habits: Habit[] = [
  { id: 'exercise', label: 'exercise' },
  { id: 'meditation', label: 'meditation' },
  { id: 'veg', label: 'veg dish' },
  { id: 'soup', label: 'soup', from: '2026-10-29' },
  { id: 'nuts', label: 'nuts', from: '2026-10-29' },
  { id: 'apple', label: 'apple' },
  { id: 'vitamin-d', label: 'vitamin d' },
  { id: 'jumping-jacks', label: 'jumping jacks', from: '2026-10-29' },
  { id: 'piano', label: 'piano', from: '2026-10-29' },
]

// Habits active on a day, plus any logged on it, so logged data never disappears from view.
export const habitsOn = (day: string, logged: string[] = []) =>
  habits.filter((h) => logged.includes(h.id) || ((!h.from || day >= h.from) && (!h.until || day <= h.until)))

export const repo = { owner: 'nightoul', name: 'routines', branch: 'master', path: 'data/medroutine-log.json' }
