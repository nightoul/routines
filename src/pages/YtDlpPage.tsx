import CopyCommand from '../components/CopyCommand'

const commands = [
  { title: 'Download audio', command: 'yt-dlp --cookies-from-browser brave -x --audio-format mp3 "VIDEO_URL"' },
  { title: 'Download video', command: 'yt-dlp --cookies-from-browser brave "VIDEO_URL"' },
  { title: 'Download video chunk', command: 'yt-dlp --cookies-from-browser brave --download-sections "*1:23-2:40" "VIDEO_URL"' },
]

function YtDlpPage() {
  return (
    <div className="site command-page compact-page yt-dlp-page">
      <header><a className="brand" href="#">routines</a></header>
      <main className="command-content">
        <div className="command-stack">
          <p className="command-intro">Keep yt-dlp up to date by running <code>brew upgrade yt-dlp</code> regularly. <CopyCommand command="brew upgrade yt-dlp" inline /></p>
          {commands.map(({ title, command }) => (
            <article className="command-item" key={title}>
              <div className="command-heading"><h2>{title}</h2><CopyCommand command={command} /></div>
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
