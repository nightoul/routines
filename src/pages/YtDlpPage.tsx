import { useState } from 'react'

const commands = [
  { title: 'Download audio', note: 'Extract an MP3 from a YouTube video.', command: 'yt-dlp --cookies-from-browser chrome -x --audio-format mp3 "VIDEO_URL"' },
  { title: 'Download video', note: 'Save the video using the best available format.', command: 'yt-dlp --cookies-from-browser chrome "VIDEO_URL"' },
  { title: 'Download video chunk', note: 'Download only a section of a video.', command: 'yt-dlp --cookies-from-browser chrome --download-sections "*1:23-2:40" "VIDEO_URL"' },
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

function YtDlpPage() {
  return (
    <div className="site command-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="command-content">
        <div className="command-stack">
          {commands.map(({ title, command }) => (
            <article className="command-item" key={title}>
              <div className="command-heading"><div><h2>{title}</h2></div><CopyCommand command={command} /></div>
              <code className="terminal-command">{command}</code>
            </article>
          ))}
        </div>
      </main>
      <footer><span>select / copy / run</span><span>yt-dlp / 02</span></footer>
    </div>
  )
}

export default YtDlpPage
