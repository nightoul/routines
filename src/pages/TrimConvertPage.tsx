import { useState } from 'react'
import ReactiveGrid from '../components/ReactiveGrid'

const commands = [
  {
    title: 'Trim',
    command: 'ffmpeg -ss 00:00:00 -to 00:00:30 -i input.mp4 -c copy output.mp4',
  },
  {
    title: 'Convert',
    command: 'ffmpeg -i input.webm output.mp4',
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

function TrimConvertPage() {
  return (
    <div className="site command-page">
      <ReactiveGrid />
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="command-content">
        <div className="command-stack trim-convert-stack">
          {commands.map(({ title, command }) => (
            <article className="command-item" key={title}>
              <div className="command-heading"><h2>{title}</h2><CopyCommand command={command} /></div>
              <code className="terminal-command">{command}</code>
            </article>
          ))}
        </div>
      </main>
      <footer><span>select / copy / run</span><span>trim / convert / 05</span></footer>
    </div>
  )
}

export default TrimConvertPage
