import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import HostsPage from './pages/HostsPage'
import MacSetupPage from './pages/MacSetupPage'
import QpdfPage from './pages/QpdfPage'
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
  return <HomePage />
}

export default App
