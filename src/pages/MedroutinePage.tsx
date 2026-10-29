import { type ReactNode, useEffect, useRef, useState } from 'react'
import { type Habit, habits, habitsOn, startDate } from '../medroutine/config'
import { ConflictError, type DaySteps, readLog, type Log, writeLog } from '../medroutine/github'

const TOKEN_KEY = 'medroutine-token'

const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d) }
const weekday = (iso: string) => parseDate(iso).toLocaleDateString('en-GB', { weekday: 'long' })
const shortDate = (iso: string) => parseDate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function loadToken() {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

function storeToken(token: string | null) {
  try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ }
}

const DAYS_AHEAD = 1

// Every day from DAYS_AHEAD days ahead back to the first shown day, newest first.
function dayRange(log: Log, today: string) {
  const first = [startDate, ...Object.keys(log.days)].sort()[0]
  const days: string[] = []
  const d = parseDate(today)
  d.setDate(d.getDate() + DAYS_AHEAD)
  for (; isoDate(d) >= first; d.setDate(d.getDate() - 1)) days.push(isoDate(d))
  return days
}

function dayTitle(day: string, today: string) {
  if (day === today) return 'Today'
  const tomorrow = parseDate(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return day === isoDate(tomorrow) ? 'Tomorrow' : weekday(day)
}

function Ring({ done, total }: { done: number, total: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg className={`med-ring${done === 0 ? ' empty' : ''}`} viewBox="0 0 64 64" aria-label={`${done} of ${total} done`}>
      <circle cx="32" cy="32" r={r} className="track" />
      <circle cx="32" cy="32" r={r} className="fill" strokeDasharray={`${(done / total) * c} ${c}`} transform="rotate(-90 32 32)" />
      <text x="32" y="32">{done}/{total}</text>
    </svg>
  )
}

function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    <dialog ref={ref} className="med-modal" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose() }}>
      {open && children}
    </dialog>
  )
}

type Info = { habit: Habit, day: string, steps: string[] }

function StepsInfo({ info, onClose }: { info: Info, onClose: () => void }) {
  return (
    <div>
      <h2>{info.habit.label}</h2>
      <p className="med-info-date">{shortDate(info.day)}</p>
      <ol className="med-steps">{info.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <div className="med-actions">
        <button className="med-primary" type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

const stepsToText = (steps: DaySteps = {}) => Object.fromEntries(Object.entries(steps).map(([id, lines]) => [id, lines.join('\n')]))
const textToSteps = (text = '') => text.split('\n').map((s) => s.trim()).filter(Boolean)

function LogForm({ log, today, onSave, onCancel }: { log: Log, today: string, onSave: (day: string, ids: string[], steps: DaySteps) => Promise<void>, onCancel: () => void }) {
  const [day, setDay] = useState(today)
  const [checked, setChecked] = useState<string[]>(log.days[today] ?? [])
  const [notes, setNotes] = useState<Record<string, string>>(stepsToText(log.steps[today]))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const pickDay = (d: string) => { setDay(d); setChecked(log.days[d] ?? []); setNotes(stepsToText(log.steps[d])); setError('') }
  const toggle = (id: string) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  // Writing steps means the habit was done.
  const writeNotes = (id: string, text: string) => {
    setNotes((n) => ({ ...n, [id]: text }))
    if (text.trim()) setChecked((c) => (c.includes(id) ? c : [...c, id]))
  }
  const submit = async () => {
    if (!day || day > today) { setError('Pick today or a past day.'); return }
    setSaving(true)
    setError('')
    const ids = habits.map((h) => h.id).filter((id) => checked.includes(id))
    const steps = Object.fromEntries(ids.map((id) => [id, textToSteps(notes[id])]).filter(([, lines]) => lines.length > 0))
    try { await onSave(day, ids, steps) } catch (e) { setError((e as Error).message); setSaving(false) }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit() }}>
      <h2>Log a day</h2>
      <label className="med-field">
        <span>day</span>
        <input type="date" value={day} max={today} onChange={(e) => pickDay(e.target.value)} required />
      </label>
      <ul className="med-checklist">
        {habitsOn(day, log.days[day]).map((h) => (
          <li key={h.id}>
            <label>
              <input type="checkbox" checked={checked.includes(h.id)} onChange={() => toggle(h.id)} />
              <span className="med-box" aria-hidden="true" />
              {h.label}
            </label>
            {h.steps && (
              <textarea className="med-steps-input" value={notes[h.id] ?? ''} onChange={(e) => writeNotes(h.id, e.target.value)} placeholder="Steps, one per line (optional)" rows={3} aria-label={`${h.label} steps`} />
            )}
          </li>
        ))}
      </ul>
      {error && <p className="med-error">{error}</p>}
      <div className="med-actions">
        <button className="med-text-button" type="button" onClick={onCancel}>Cancel</button>
        <button className="med-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}

function ConnectForm({ onConnect, onCancel }: { onConnect: (token: string) => void, onCancel: () => void }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (token.trim()) onConnect(token.trim()); else setError('Paste a token first.') }}>
      <h2>Connect GitHub</h2>
      <p>Create a fine-grained token for <code>nightoul/routines</code> with <code>Contents: read and write</code>. It stays in this browser only.</p>
      <label className="med-field">
        <span>token</span>
        <input type="password" value={token} onChange={(e) => { setToken(e.target.value); setError('') }} placeholder="github_pat_…" autoComplete="off" spellCheck={false} />
      </label>
      {error && <p className="med-error">{error}</p>}
      <div className="med-actions">
        <button className="med-text-button" type="button" onClick={onCancel}>Cancel</button>
        <button className="med-primary" type="submit">Connect</button>
      </div>
    </form>
  )
}

function MedroutinePage() {
  const [token, setToken] = useState(loadToken)
  const [log, setLog] = useState<Log>({ days: {}, steps: {} })
  const [loadError, setLoadError] = useState('')
  const [modal, setModal] = useState<'log' | 'connect' | null>(null)
  const [info, setInfo] = useState<Info | null>(null)
  const sha = useRef<string | null>(null)
  const today = isoDate(new Date())

  useEffect(() => {
    readLog(token)
      .then((file) => { setLog(file.log); sha.current = file.sha; setLoadError('') })
      .catch((e: Error) => setLoadError(e.message))
  }, [token])

  const saveDay = async (day: string, ids: string[], daySteps: DaySteps) => {
    if (!token) throw new Error('Connect GitHub first.')
    const withDay = (base: Log) => {
      const days = { ...base.days, [day]: ids }
      if (ids.length === 0) delete days[day]
      const steps = { ...base.steps, [day]: daySteps }
      if (Object.keys(daySteps).length === 0) delete steps[day]
      return { days, steps }
    }
    const message = `medroutine: log ${day}`
    let next = withDay(log)
    try {
      sha.current = await writeLog(token, next, sha.current, message)
    } catch (e) {
      if (!(e instanceof ConflictError)) throw e
      // Another device saved first: start from its version and apply this day on top.
      const remote = await readLog(token)
      next = withDay(remote.log)
      sha.current = await writeLog(token, next, remote.sha, message)
    }
    setLog(next)
    setModal(null)
  }

  const connect = (t: string) => { storeToken(t); setToken(t); setModal('log') }
  const disconnect = () => { storeToken(null); setToken(null) }

  const days = dayRange(log, today)

  return (
    <div className="site medroutine-page">
      <header className="med-header">
        <nav><a className="brand" href="#">routines</a><span>medroutine</span></nav>
        <div className="med-header-actions">
          {token
            ? <button className="med-text-button" type="button" onClick={disconnect}>Disconnect</button>
            : <button className="med-text-button" type="button" onClick={() => setModal('connect')}>Connect</button>}
          <button className="med-primary" type="button" onClick={() => setModal(token ? 'log' : 'connect')}>Log a day</button>
        </div>
      </header>

      <main className="med-content">
        {loadError && <p className="med-error">Couldn't load the log: {loadError}</p>}
        <ol className="med-days">
          {days.map((day) => {
            const active = habitsOn(day, log.days[day])
            const done = active.filter((h) => log.days[day]?.includes(h.id))
            return (
              <li className={`med-day${day > today ? ' upcoming' : done.length === 0 && day < today ? ' skipped' : ''}`} key={day}>
                <div className="med-day-label">
                  <h2>{dayTitle(day, today)}</h2>
                  <p>{shortDate(day)}</p>
                </div>
                <div className="med-strip">
                  {active.map((h) => {
                    const isDone = done.includes(h)
                    const content = (
                      <>
                        <span className="med-box" aria-hidden="true" />
                        <span>{h.label}<span className="sr-only">{isDone ? ', done' : ', not done'}</span></span>
                      </>
                    )
                    const steps = log.steps[day]?.[h.id]
                    return steps?.length
                      ? <button className={`med-tile has-steps${isDone ? ' done' : ''}`} type="button" key={h.id} onClick={() => setInfo({ habit: h, day, steps })} title="Show steps">{content}</button>
                      : <div className={`med-tile${isDone ? ' done' : ''}`} key={h.id}>{content}</div>
                  })}
                </div>
                <Ring done={done.length} total={active.length} />
              </li>
            )
          })}
        </ol>
      </main>
      <footer><span>medroutine / 01B</span></footer>

      <Modal open={modal !== null} onClose={() => setModal(null)}>
        {modal === 'log' && <LogForm log={log} today={today} onSave={saveDay} onCancel={() => setModal(null)} />}
        {modal === 'connect' && <ConnectForm onConnect={connect} onCancel={() => setModal(null)} />}
      </Modal>
      <Modal open={info !== null} onClose={() => setInfo(null)}>
        {info && <StepsInfo info={info} onClose={() => setInfo(null)} />}
      </Modal>
    </div>
  )
}

export default MedroutinePage
