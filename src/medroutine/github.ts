import { repo } from './config'

export type Log = { days: Record<string, string[]> }
export type LogFile = { log: Log, sha: string | null }

const url = `https://api.github.com/repos/${repo.owner}/${repo.name}/contents/${repo.path}`

const headers = (token: string | null) => ({
  Accept: 'application/vnd.github+json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

const decode = (base64: string) => new TextDecoder().decode(Uint8Array.from(atob(base64.replace(/\n/g, '')), (c) => c.charCodeAt(0)))
const encode = (text: string) => btoa(Array.from(new TextEncoder().encode(text), (b) => String.fromCharCode(b)).join(''))

export async function readLog(token: string | null): Promise<LogFile> {
  const res = await fetch(`${url}?ref=${repo.branch}`, { headers: headers(token), cache: 'no-store' })
  if (res.status === 404) return { log: { days: {} }, sha: null }
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`)
  const body = await res.json()
  const log = JSON.parse(decode(body.content)) as Log
  return { log: { days: log.days ?? {} }, sha: body.sha }
}

export class ConflictError extends Error {}

export async function writeLog(token: string, log: Log, sha: string | null, message: string): Promise<string> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, branch: repo.branch, content: encode(`${JSON.stringify(log, null, 2)}\n`), ...(sha ? { sha } : {}) }),
  })
  if (res.status === 409 || res.status === 422) throw new ConflictError('The log changed on GitHub')
  if (res.status === 401 || res.status === 403) throw new Error('Token rejected by GitHub')
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`)
  return (await res.json()).content.sha
}
