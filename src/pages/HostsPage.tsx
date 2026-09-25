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
    <div className="site command-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="command-content hosts-content">
        <section className="hosts-group" aria-labelledby="block-title">
          <div className="hosts-heading"><span>01</span><h2 id="block-title">Block</h2></div>
          <ol><li><CommandBlock command={commands.open} /></li><li>Add these lines:</li></ol>
          <CommandBlock command={commands.hosts} />
          <ol start={3}><li>Save with <kbd>Ctrl + O</kbd>, press <kbd>Enter</kbd>, then exit with <kbd>Ctrl + X</kbd>.</li><li>Flush the DNS cache:</li></ol>
          <CommandBlock command={commands.flush} />
        </section>
        <section className="hosts-group" aria-labelledby="unblock-title">
          <div className="hosts-heading"><span>02</span><h2 id="unblock-title">Unblock</h2></div>
          <ol><li><CommandBlock command={commands.open} /></li><li>Remove the Instagram lines.</li><li>Flush the DNS cache:</li></ol>
          <CommandBlock command={commands.flush} />
        </section>
      </main>
      <footer><span>edit / save / flush</span><span>etc / hosts / 07</span></footer>
    </div>
  )
}

export default HostsPage
