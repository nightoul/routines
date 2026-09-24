import { useState } from 'react'

const commands = [
  'cd /Users/jakubjenc/whisper',
  'source venv/bin/activate',
  'whisper ~/Desktop/Untitled.mp3 --model large-v3',
  'deactivate',
]

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <button className="copy-command" type="button" onClick={copy}>{copied ? 'copied' : 'copy'}</button>
}

function WhisperPage() {
  return (
    <div className="site command-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="command-content">
        <div className="command-stack whisper-stack">
          {commands.map((command) => (
            <article className="whisper-command" key={command}>
              <code className="terminal-command">{command}</code>
              <CopyCommand command={command} />
            </article>
          ))}
        </div>
      </main>
      <footer><span>select / copy / run</span><span>whisper / 03</span></footer>
    </div>
  )
}

export default WhisperPage
