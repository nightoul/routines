import { useState } from 'react'

function CopyCommand({ command, inline = false }: { command: string, inline?: boolean }) {
  const [label, setLabel] = useState('copy')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setLabel('copied')
    } catch {
      setLabel('copy failed')
    }
    window.setTimeout(() => setLabel('copy'), 1600)
  }
  return <button className={`copy-command${inline ? ' inline-copy' : ''}`} type="button" onClick={copy}>{label}</button>
}

export default CopyCommand
