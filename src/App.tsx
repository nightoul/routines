import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import HostsPage from './pages/HostsPage'
import MacSetupPage from './pages/MacSetupPage'
import MedroutinePage from './pages/MedroutinePage'
import QpdfPage from './pages/QpdfPage'
import RecipesPage from './pages/RecipesPage'
import PeceneHroznyPage from './pages/recipes/lunch/PeceneHroznyPage'
import BrokolicovaPage from './pages/recipes/soups/BrokolicovaPage'
import CockovaPage from './pages/recipes/soups/CockovaPage'
import DynovaPage from './pages/recipes/soups/DynovaPage'
import MrkvovaPage from './pages/recipes/soups/MrkvovaPage'
import SpenatovaPage from './pages/recipes/soups/SpenatovaPage'
import TrimConvertPage from './pages/TrimConvertPage'
import WhisperPage from './pages/WhisperPage'
import YtDlpPage from './pages/YtDlpPage'

function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (hash === '#yt-dlp') return <YtDlpPage />
  if (hash === '#whisper') return <WhisperPage />
  if (hash === '#qpdf') return <QpdfPage />
  if (hash === '#trim-convert') return <TrimConvertPage />
  if (hash.startsWith('#mac-setup')) return <MacSetupPage />
  if (hash === '#etc-hosts') return <HostsPage />
  if (hash === '#medroutine') return <MedroutinePage />
  if (hash === '#recipes/lunch/pecene-hrozny') return <PeceneHroznyPage />
  if (hash === '#recipes/soups/spenatova') return <SpenatovaPage />
  if (hash === '#recipes/soups/cockova') return <CockovaPage />
  if (hash === '#recipes/soups/brokolicova') return <BrokolicovaPage />
  if (hash === '#recipes/soups/dynova') return <DynovaPage />
  if (hash === '#recipes/soups/mrkvova') return <MrkvovaPage />
  if (hash.startsWith('#recipes')) return <RecipesPage />
  return <HomePage />
}

export default App
