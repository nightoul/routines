// Edit this list to change the daily habits. Keep ids stable: the log stores ids, so renaming a label is safe.
export const habits = [
  { id: 'exercise', label: 'exercise' },
  { id: 'vitamin-d', label: 'vitamin d' },
  { id: 'apple', label: 'apple' },
  { id: 'pray', label: 'pray' },
  { id: 'veg', label: 'veg dish' },
]

// The first day shown in the log.
export const startDate = '2026-10-29'

export const repo = { owner: 'nightoul', name: 'routines', branch: 'master', path: 'data/medroutine-log.json' }
