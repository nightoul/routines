import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import YtDlpPage from './pages/YtDlpPage'

function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return hash === '#yt-dlp' ? <YtDlpPage /> : <HomePage />
}

export default App
