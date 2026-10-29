import ReactiveGrid from '../components/ReactiveGrid'

function HomePage() {
  return (
    <div className="site home-page">
      <ReactiveGrid />
      <header><a className="brand" href="#top">routines</a><p>sept 22 / 2026</p></header>
      <main id="top">
        <h1>routines<span className="title-dot">.</span></h1>
        <div className="intro-bottom"><p>A growing archive of routines worth writing down once.</p></div>
        <nav className="free-links" aria-label="Collections">
          <a href="#recipes">01A / recipes</a><a href="#medroutine">01B / medroutine</a><a href="#yt-dlp">02 / yt-dlp</a><a href="#whisper">03 / whisper</a><a href="#qpdf">04 / qpdf</a><a href="#trim-convert">05 / trim / convert</a><a href="#mac-setup">06 / Mac setup</a><a href="#etc-hosts">07 / etc / hosts</a>
        </nav>
      </main>
      <footer><span>move your cursor</span><span>routines / 01a—07</span></footer>
    </div>
  )
}

export default HomePage
