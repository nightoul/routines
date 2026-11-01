import CopyCommand from '../components/CopyCommand'

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

function TrimConvertPage() {
  return (
    <div className="site command-page compact-page">
      <header><a className="brand" href="#">routines</a></header>
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
      <footer><span>trim / convert / 05</span></footer>
    </div>
  )
}

export default TrimConvertPage
