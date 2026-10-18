import { useState } from 'react'

const commands = [
  { title: 'Download audio', note: 'Extract an MP3 from a YouTube video.', command: 'yt-dlp --cookies-from-browser brave -x --audio-format mp3 "VIDEO_URL"' },
  { title: 'Download video', note: 'Save the video using the best available format.', command: 'yt-dlp --cookies-from-browser brave "VIDEO_URL"' },
  { title: 'Download video chunk', note: 'Download only a section of a video.', command: 'yt-dlp --cookies-from-browser brave --download-sections "*1:23-2:40" "VIDEO_URL"' },
]

function CopyCommand({ command, inline = false }: { command: string, inline?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <button className={`copy-command${inline ? ' inline-copy' : ''}`} type="button" onClick={copy}>{copied ? 'copied' : 'copy'}</button>
}

function YtDlpPage() {
  return (
    <div className="site command-page compact-page yt-dlp-page">
      <header><a className="brand" href="#">routines</a></header>
      <main className="command-content">
        <div className="command-stack">
          <p className="command-intro">Keep yt-dlp up to date by running <code>brew upgrade yt-dlp</code> regularly. <CopyCommand command="brew upgrade yt-dlp" inline /></p>
          {commands.map(({ title, command }) => (
            <article className="command-item" key={title}>
              <div className="command-heading"><div><h2>{title}</h2></div><CopyCommand command={command} /></div>
              <code className="terminal-command">{command}</code>
            </article>
          ))}
        </div>
      </main>
      <footer><span>yt-dlp / 02</span></footer>
    </div>
  )
}

export default YtDlpPage
