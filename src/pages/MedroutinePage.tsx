import { type ReactNode, useEffect, useRef, useState } from 'react'
import { type Habit, habits, habitsOn, startDate } from '../medroutine/config'
import { ConflictError, type DayNotes, readLog, type Log, writeLog } from '../medroutine/github'

const TOKEN_KEY = 'medroutine-token'
const DAYS_AHEAD = 1

const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d) }
const addDays = (iso: string, n: number) => { const d = parseDate(iso); d.setDate(d.getDate() + n); return isoDate(d) }
const weekday = (iso: string) => parseDate(iso).toLocaleDateString('en-GB', { weekday: 'long' })
const shortDate = (iso: string) => parseDate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function loadToken() {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

function storeToken(token: string | null) {
  try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ }
}

// Every day from DAYS_AHEAD days ahead back to the first shown day, newest first.
function dayRange(log: Log, today: string) {
  const first = [startDate, ...Object.keys(log.days)].sort()[0]
  const days: string[] = []
  for (let d = addDays(today, DAYS_AHEAD); d >= first; d = addDays(d, -1)) days.push(d)
  return days
}

function dayTitle(day: string, today: string) {
  if (day === today) return 'Today'
  return day === addDays(today, 1) ? 'Tomorrow' : weekday(day)
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

function Modal({ open, wide = false, onClose, children }: { open: boolean, wide?: boolean, onClose: () => void, children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    <dialog ref={ref} className={`med-modal${wide ? ' wide' : ''}`} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose() }}>
      {open && children}
    </dialog>
  )
}

type NoteView = { habit: Habit, day: string, note: string }

function NoteInfo({ habit, day, note, onClose }: NoteView & { onClose: () => void }) {
  return (
    <div>
      <h2>{habit.label}</h2>
      <p className="med-info-date">{shortDate(day)}</p>
      <p className="med-note">{note}</p>
      <div className="med-actions">
        <button className="med-primary" type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

function LogForm({ log, today, onSave, onCancel }: { log: Log, today: string, onSave: (day: string, ids: string[], notes: DayNotes) => Promise<void>, onCancel: () => void }) {
  const [day, setDay] = useState(today)
  const [checked, setChecked] = useState<string[]>(log.days[today] ?? [])
  const [notes, setNotes] = useState<DayNotes>(log.notes[today] ?? {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const pickDay = (d: string) => { setDay(d); setChecked(log.days[d] ?? []); setNotes(log.notes[d] ?? {}); setError('') }
  const toggle = (id: string) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  const submit = async () => {
    if (!day || day > today) { setError('Pick today or a past day.'); return }
    setSaving(true)
    setError('')
    const ids = habits.map((h) => h.id).filter((id) => checked.includes(id))
    const dayNotes = Object.fromEntries(habits.map((h) => [h.id, notes[h.id]?.trim()]).filter(([, text]) => text))
    try { await onSave(day, ids, dayNotes) } catch (e) { setError((e as Error).message); setSaving(false) }
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
            <textarea className="med-note-input" value={notes[h.id] ?? ''} onChange={(e) => setNotes((n) => ({ ...n, [h.id]: e.target.value }))} placeholder="Note (optional)" rows={1} aria-label={`${h.label} note`} />
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

type ModalState = 'log' | 'connect' | NoteView | null

function MedroutinePage() {
  const [token, setToken] = useState(loadToken)
  const [log, setLog] = useState<Log>({ days: {}, notes: {} })
  const [loadError, setLoadError] = useState('')
  const [modal, setModal] = useState<ModalState>(null)
  const sha = useRef<string | null>(null)
  const today = isoDate(new Date())
  const close = () => setModal(null)

  useEffect(() => {
    readLog(token)
      .then((file) => { setLog(file.log); sha.current = file.sha; setLoadError('') })
      .catch((e: Error) => setLoadError(e.message))
  }, [token])

  const saveDay = async (day: string, ids: string[], dayNotes: DayNotes) => {
    if (!token) throw new Error('Connect GitHub first.')
    const withDay = (base: Log) => {
      const days = { ...base.days, [day]: ids }
      const notes = { ...base.notes, [day]: dayNotes }
      if (ids.length === 0) delete days[day]
      if (Object.keys(dayNotes).length === 0) delete notes[day]
      return { days, notes }
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
    close()
  }

  const connect = (t: string) => { storeToken(t); setToken(t); setModal('log') }
  const disconnect = () => { storeToken(null); setToken(null) }

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
          {dayRange(log, today).map((day) => {
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
                    const note = log.notes[day]?.[h.id]
                    const className = `med-tile${isDone ? ' done' : ''}${note ? ' has-note' : ''}`
                    const content = (
                      <>
                        <span className="med-box" aria-hidden="true" />
                        <span>{h.label}<span className="sr-only">{isDone ? ', done' : ', not done'}</span></span>
                      </>
                    )
                    return note
                      ? <button className={className} type="button" key={h.id} onClick={() => setModal({ habit: h, day, note })} title="Show note">{content}</button>
                      : <div className={className} key={h.id}>{content}</div>
                  })}
                </div>
                <Ring done={done.length} total={active.length} />
              </li>
            )
          })}
        </ol>
      </main>
      <footer><span>medroutine / 01B</span></footer>

      <Modal open={modal !== null} wide={modal === 'log'} onClose={close}>
        {modal === 'log' && <LogForm log={log} today={today} onSave={saveDay} onCancel={close} />}
        {modal === 'connect' && <ConnectForm onConnect={connect} onCancel={close} />}
        {typeof modal === 'object' && modal && <NoteInfo {...modal} onClose={close} />}
      </Modal>
    </div>
  )
}

export default MedroutinePage
