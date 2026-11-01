import CopyCommand from '../components/CopyCommand'

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

function QpdfPage() {
  return (
    <div className="site command-page compact-page">
      <header><a className="brand" href="#">routines</a></header>
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
      <footer><span>qpdf / 04</span></footer>
    </div>
  )
}

export default QpdfPage
