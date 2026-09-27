function PeceneHroznyPage() {
  return (
    <div className="site recipe-page compact-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="recipe-content">
        <section className="recipe-section recipe-detail">
          <a className="recipe-back" href="#recipes">recepty</a>
          <div className="recipe-grid">
            <article className="recipe-card">
              <h2>suroviny</h2>
              <ul>
                <li>2 střední batáty (asi 500 g)</li>
                <li>1 konzerva cizrny (400 g / asi 240 g po slití)</li>
                <li>250 g bezsemenných hroznů</li>
                <li>125 g mozzarelly / 150 g fety</li>
                <li>2 lžíce olivového oleje</li>
                <li>tymián / rozmarýn / oregano</li>
                <li>sůl a čerstvě mletý pepř</li>
              </ul>
            </article>
            <article className="recipe-card recipe-method">
              <h2>postup</h2>
              <ol>
                <li>Rozehřej troubu. Nakrájej batáty.</li>
                <li>Na pekáč dej 1 lžíci oleje, v jedné vrstvě rozprostři batáty, osol a opepři. Peč <strong>20 minut</strong>.</li>
                <li>Slij a osuš cizrnu. Připrav hrozny.</li>
                <li>Po 20 minutách přidej cizrnu a hrozny a peč dalších <strong>15 minut</strong>.</li>
                <li>Přidej mozzarellu na posledních <strong>5 minut</strong>.</li>
              </ol>
            </article>
          </div>
        </section>
      </main>
      <footer><span>recepty / 01</span></footer>
    </div>
  )
}

export default PeceneHroznyPage
