import './App.css'

const sections = [
  { number: '01', title: 'Recipes', description: 'The food you make on repeat, written down exactly the way you need it.', className: 'recipes' },
  { number: '02', title: 'Mac commands', description: 'Small terminal spells for downloads, PDFs, files, and the rest of the useful stuff.', className: 'commands' },
  { number: '03', title: 'Fresh Mac setup', description: 'A calm, ordered path from factory reset to a computer that feels like yours.', className: 'setup' },
]

function ArrowUpRight() { return <span aria-hidden="true">↗</span> }

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Routines home"><span className="wordmark-mark" aria-hidden="true">R</span>routines</a>
        <span className="header-note">A personal reference library</span>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow"><span /> YOUR EVERYDAY SYSTEMS</p>
          <h1 id="page-title">Useful things,<br /><em>kept close.</em></h1>
          <p className="intro-copy">A living collection of the routines that make everyday life run a little smoother.</p>
          <a className="jump-link" href="#collections">Browse collections <ArrowUpRight /></a>
        </section>

        <section className="collections" id="collections" aria-labelledby="collections-title">
          <div className="section-heading"><p className="eyebrow"><span /> THE SHELVES</p><h2 id="collections-title">Start where you are.</h2></div>
          <div className="collection-grid">
            {sections.map((section) => (
              <a className={`collection-card ${section.className}`} href={`#${section.className}`} key={section.title}>
                <div className="card-topline"><span>{section.number}</span><ArrowUpRight /></div>
                <div className="card-content"><h3>{section.title}</h3><p>{section.description}</p></div>
                {section.className === 'recipes' && <div className="recipe-preview" aria-hidden="true"><span>Tonight&apos;s familiar</span><strong>Tomato pasta</strong><small>20 min · one pan</small></div>}
                {section.className === 'commands' && <div className="command-preview" aria-hidden="true"><span>$</span> yt-dlp -f bestvideo<br /><span>$</span> pdftotext notes.pdf</div>}
                {section.className === 'setup' && <ul className="setup-preview" aria-hidden="true"><li><span>✓</span> Homebrew</li><li><span>✓</span> Dotfiles</li><li><i /> Apps &amp; preferences</li></ul>}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer><p>Made for the routines worth remembering.</p><span>01 / 03</span></footer>
    </div>
  )
}

export default App
