import CopyCommand from '../components/CopyCommand'

const commands = [
  'source ~/whisper-env/bin/activate',
  'whisper ~/Desktop/Untitled.mp3 --model large-v3 --output_dir ~/Desktop',
  'deactivate',
]

function WhisperPage() {
  return (
    <div className="site command-page compact-page">
      <header><a className="brand" href="#">routines</a></header>
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
      <footer><span>whisper / 03</span></footer>
    </div>
  )
}

export default WhisperPage
