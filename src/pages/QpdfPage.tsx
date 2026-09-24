import { useState } from 'react'

const splitCommands = [
  {
    label: 'Split PDF',
    command: 'qpdf --empty --pages input.pdf 12-45 -- output.pdf',
  },
  {
    label: 'or',
    command: 'qpdf --empty --pages input.pdf 12,45 -- output.pdf',
  },
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

function QpdfPage() {
  return (
    <div className="site command-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="command-content">
        <div className="command-stack qpdf-stack">
          {splitCommands.map(({ label, command }) => (
            <article className="command-item" key={command}>
              <div className="command-heading"><h2>{label}</h2><CopyCommand command={command} /></div>
              <code className="terminal-command">{command}</code>
            </article>
          ))}
        </div>
      </main>
      <footer><span>select / copy / run</span><span>qpdf / 04</span></footer>
    </div>
  )
}

export default QpdfPage
