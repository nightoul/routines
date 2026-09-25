const categories = [
  { name: 'Breakfast', number: '01', className: 'breakfast', recipes: ['Vločky', 'coming soon'] },
  { name: 'Lunch / dinner', number: '02', className: 'lunch', recipes: ['coming soon', 'coming soon', 'coming soon', 'coming soon'] },
  { name: 'Salads', number: '03', className: 'salads', recipes: ['coming soon', 'coming soon'] },
  { name: 'Soups', number: '04', className: 'soups', recipes: ['coming soon'] },
  { name: 'Other', number: '05', className: 'other', recipes: ['coming soon', 'coming soon', 'coming soon'] },
]

function recipeHref(recipe: string) {
  return recipe === 'Vločky' ? '#recipes/vlocky' : undefined
}

function RecipesPage() {
  return (
    <div className="site recipes-index-page compact-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="recipes-index-content">
        <div className="recipe-catalog" aria-label="Recipe categories">
          {categories.map((category) => (
            <section className={`recipe-category ${category.className}`} key={category.name}>
              <div className="category-heading"><span>{category.number}</span><h2>{category.name}</h2><small>{category.recipes.length} entries</small></div>
              <ol>
                {category.recipes.map((recipe, index) => {
                  const href = recipeHref(recipe)
                  return (
                    <li key={`${recipe}-${index}`}>
                      {href ? <a href={href}>{recipe}<span>↗</span></a> : <span className="recipe-placeholder"><b>{String(index + 1).padStart(2, '0')}</b>{recipe}</span>}
                    </li>
                  )
                })}
              </ol>
              <span className="category-mark">+</span>
            </section>
          ))}
        </div>
      </main>
      <footer><span>recipes / a growing collection</span><span>05 categories</span></footer>
    </div>
  )
}

export default RecipesPage
