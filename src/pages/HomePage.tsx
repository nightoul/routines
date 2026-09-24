import ReactiveGrid from '../components/ReactiveGrid'

function HomePage() {
  return (
    <div className="site">
      <ReactiveGrid />
      <header><a className="brand" href="#top">routines</a><p>personal reference / 2026</p></header>
      <main id="top">
        <div className="intro-meta"><span>home</span><span>quiet systems for everyday life</span></div>
        <h1>routines<span className="title-dot">.</span></h1>
        <div className="intro-bottom"><p>A growing archive of routines and the small things worth writing down once.</p></div>
        <nav className="free-links" aria-label="Collections">
          <a href="#recipes">01 / recipes</a><a href="#yt-dlp">02 / yt-dlp</a><a href="#whisper">03 / whisper</a><a href="#qpdf">04 / qpdf</a><a href="#trim-convert">05 / trim / convert</a><a href="#mac-setup">06 / Mac setup</a>
        </nav>
      </main>
      <footer><span>move your cursor</span><span>routines / 01—06</span></footer>
    </div>
  )
}

export default HomePage
