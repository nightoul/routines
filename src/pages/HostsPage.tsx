import { useState } from 'react'

const commands = {
  open: 'sudo nano /etc/hosts',
  hosts: '127.0.0.1 instagram.com\n127.0.0.1 www.instagram.com',
  flush: 'sudo dscacheutil -flushcache\nsudo killall -HUP mDNSResponder',
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <button className="copy-command" type="button" onClick={copy}>{copied ? 'copied' : 'copy'}</button>
}

function CommandBlock({ command }: { command: string }) {
  return <div className="hosts-command"><code>{command}</code><CopyCommand command={command} /></div>
}

function HostsPage() {
  return (
    <div className="site command-page compact-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="command-content hosts-content">
        <section className="hosts-group" aria-label="Instagram hosts file instructions">
          <ol><li>Open the hosts file:</li></ol>
          <CommandBlock command={commands.open} />
          <ol start={2}><li>To block Instagram, add these lines:</li></ol>
          <CommandBlock command={commands.hosts} />
          <ol start={3}><li>To unblock it later, remove those two lines.</li><li>Save with <kbd>Ctrl + O</kbd>, press <kbd>Enter</kbd>, then exit with <kbd>Ctrl + X</kbd>.</li><li>Flush the DNS cache:</li></ol>
          <CommandBlock command={commands.flush} />
        </section>
      </main>
      <footer><span>edit / save / flush</span><span>etc / hosts / 07</span></footer>
    </div>
  )
}

export default HostsPage
