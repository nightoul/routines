import { useEffect, useState } from 'react'

const dockCommand = 'defaults write com.apple.dock autohide-time-modifier -int 0; killall Dock'
const promptCommand = "PROMPT='%F{green}%n %~$%f '"
const homebrewCommands = [
  'brew install git',
  'which git',
  'brew install gh',
  'gh auth login',
  'brew update',
  'brew upgrade',
  'brew install node',
  'brew install blackhole-2ch',
  'brew install yt-dlp',
  'brew upgrade yt-dlp',
  'brew install qpdf',
]

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <button className="copy-command" type="button" onClick={copy}>{copied ? 'copied' : 'copy'}</button>
}

function SetupCode({ command }: { command: string }) {
  return <div className="setup-command"><code>{command}</code><CopyCommand command={command} /></div>
}

function MacSetupPage() {
  useEffect(() => {
    const scrollToSection = () => {
      const [, section] = window.location.hash.split('/')
      if (section) window.requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }))
    }

    scrollToSection()
    window.addEventListener('hashchange', scrollToSection)
    return () => window.removeEventListener('hashchange', scrollToSection)
  }, [])

  return (
    <div className="site setup-page">
      <header><a className="brand" href="#">routines</a><p>personal reference / 2026</p></header>
      <main className="setup-content">
        <div className="setup-title"><p>mac setup</p><h1>mac<span className="title-dot">.</span></h1></div>
        <nav className="setup-nav" aria-label="Mac setup sections">
          <a href="#mac-setup/mac">01 / mac</a>
          <a href="#mac-setup/textedit">02 / textedit</a>
          <a href="#mac-setup/terminal">03 / terminal</a>
          <a href="#mac-setup/homebrew">04 / homebrew</a>
          <a href="#mac-setup/applications">05 / applications</a>
        </nav>

        <section className="setup-section" id="mac" aria-labelledby="preferences-title">
          <div className="setup-section-heading"><p>01 / mac</p><h2 id="preferences-title">System Preferences</h2></div>

          <article className="preference-group">
            <h3><span>A</span> Appearance</h3>
            <ol><li>Set <strong>Dark</strong> theme.</li><li>Set <strong>Show scroll bars</strong> to <strong>Always</strong>.</li></ol>
          </article>

          <article className="preference-group">
            <h3><span>B</span> Keyboard</h3>
            <ol>
              <li>In <strong>Keyboard Shortcuts</strong>, untick everything in every category except:
                <ul className="shortcut-list">
                  <li><span>Mission Control / Show Desktop</span><kbd>⌘ 3</kbd></li>
                  <li><span>Input Sources / Select the previous input source</span><kbd>⌃ Space</kbd></li>
                  <li><span>Screenshots / Screenshot and recording options</span><kbd>⌘ ⇧ 3</kbd></li>
                  <li><span>Spotlight / Show Spotlight Search</span><kbd>⌘ Space</kbd></li>
                </ul>
              </li>
              <li>In <strong>Input Sources</strong>, add English. It will appear as <strong>ABC</strong>.</li>
              <li>In <strong>Touch Bar Settings</strong>:
                <ul><li>Set <strong>Touch Bar Shows</strong> to <strong>Expanded Control Strip</strong>.</li><li>Choose <strong>Customize Control Strip</strong>: Keyboard brightness · nothing · Brightness · nothing · Volume.</li></ul>
              </li>
              <li>Set <strong>Press Fn</strong> (bottom-left key) to <strong>Do Nothing</strong>.</li>
              <li>Turn <strong>Auto-punctuation</strong> off.</li>
            </ol>
          </article>

          <article className="preference-group">
            <h3><span>C</span> Trackpad</h3>
            <ol><li>Disable everything except <strong>Secondary click</strong>, <strong>Scroll direction: Natural</strong>, and <strong>Zoom in or out</strong>.</li></ol>
          </article>

          <article className="preference-group">
            <h3><span>D</span> Desktop &amp; Dock</h3>
            <ol>
              <li>Set <strong>Position on screen</strong> to <strong>Left</strong>.</li>
              <li>Untick <strong>Show suggested and recent apps in Dock</strong>.</li>
              <li>Tick <strong>Automatically hide and show Dock</strong>.</li>
              <li>Remove unwanted apps from the Dock.</li>
              <li>Run this for instant Dock animation:</li>
            </ol>
            <SetupCode command={dockCommand} />
          </article>

          <article className="preference-group">
            <h3><span>E</span> Other</h3>
            <ol>
              <li>For zooming with Control: <strong>Accessibility → Zoom</strong> → tick <strong>Use scroll gesture with modifier keys to zoom</strong>.</li>
              <li>Right-click desktop → <strong>Show View Options</strong> → set <strong>Sort By</strong> to <strong>Snap to Grid</strong>.</li>
              <li>Finder Preferences → General → set <strong>New Finder window shows</strong> to <strong>Documents</strong>, not Recents.</li>
              <li>Sound → Sound Effects → untick <strong>Play user interface sound effects</strong>.</li>
              <li>Spotlight → uncheck everything except <strong>Applications</strong> and <strong>Calculator</strong>.</li>
            </ol>
          </article>
        </section>

        <section className="setup-section" id="textedit" aria-labelledby="textedit-title">
          <div className="setup-section-heading"><p>02 / textedit</p><h2 id="textedit-title">TextEdit</h2></div>
          <article className="preference-group">
            <ol>
              <li>In Preferences, set <strong>Use the format menu to choose settings for an open document</strong> to <strong>Plain text</strong>.</li>
              <li>Set the font to <strong>Menlo Regular 14</strong>.</li>
              <li>Untick every option at the bottom, including spell-checking options.</li>
            </ol>
          </article>
        </section>

        <section className="setup-section" id="terminal" aria-labelledby="terminal-title">
          <div className="setup-section-heading"><p>03 / terminal</p><h2 id="terminal-title">Terminal</h2></div>
          <article className="preference-group terminal-reading">
            <h3><span>1</span> What is a shell?</h3>
            <p>When you type a command such as <code>pwd</code> into Terminal, a shell reads and executes it. It is the command-line interface between you and the operating system.</p>
            <p>macOS includes several shells. Its default is <strong>zsh</strong> (Z shell); others include bash, sh, dash, csh, tcsh, and ksh. They live in the hidden <code>/bin</code> directory at the system root.</p>
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>2</span> What is the PATH variable?</h3>
            <p><code>PATH</code> is an environment variable: a key-value pair that stores the directories containing executable commands. On a new Mac, it can look like this:</p>
            <code className="inline-code">/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</code>
            <p>When you enter a command, the shell looks through these directories and runs the first matching executable. As you add tools such as Homebrew, Git, Node, and npm, their paths need to be available here too. Otherwise you would need to type full paths such as <code>/opt/homebrew/bin/brew install git</code>.</p>
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>3</span> What are <code>.zprofile</code> and <code>.zshrc</code>?</h3>
            <p>These are zsh configuration files in your home directory, <code>/Users/jakubjenc</code>. Create them if they do not exist:</p>
            <SetupCode command="touch .zprofile" />
            <SetupCode command="touch .zshrc" />
            <p><code>.zprofile</code> is typically used to extend <code>PATH</code>. <code>.zshrc</code> is for the interactive Terminal experience: prompts, aliases, and plugins.</p>
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>4</span> Customize the prompt</h3>
            <p>Open <code>.zshrc</code> and add this line. It makes the prompt green and displays the username and current directory.</p>
            <SetupCode command={promptCommand} />
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>5</span> Terminal preferences</h3>
            <p>Open Terminal Preferences with <kbd>⌘ ,</kbd>. In Profiles → Text, set <strong>SF Mono Regular</strong> at <strong>14 pt</strong>. In the Keyboard tab, tick <strong>Use Option as Meta key</strong>.</p>
          </article>
        </section>

        <section className="setup-section" id="homebrew" aria-labelledby="homebrew-title">
          <div className="setup-section-heading"><p>04 / homebrew</p><h2 id="homebrew-title">Homebrew</h2></div>
          <article className="preference-group terminal-reading">
            <p>A package manager installs and manages software system-wide. A dependency manager handles libraries for one project. A runtime executes server-side code, and version control tracks code over time. Here, Homebrew manages system packages, npm handles project dependencies, Node.js is the JavaScript runtime, and Git provides version control.</p>
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>1</span> Homebrew</h3>
            <p>Install Homebrew from its website using its Terminal command or the <code>.pkg</code> installer. Then add this to <code>.zprofile</code> so the shell finds <code>brew</code> every time Terminal opens:</p>
            <SetupCode command={'eval "$(/opt/homebrew/bin/brew shellenv)"'} />
            <p>Tools installed through Homebrew live in its directory, so you usually only need to configure PATH once.</p>
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>2</span> Git &amp; GitHub CLI</h3>
            <p>Install Git, verify its path, then install and authenticate GitHub CLI.</p>
            {homebrewCommands.slice(0, 4).map((command) => <SetupCode command={command} key={command} />)}
          </article>
          <article className="preference-group terminal-reading">
            <h3><span>3</span> Other tools</h3>
            <p>Keep Homebrew up to date, then install the tools used elsewhere in this archive.</p>
            {homebrewCommands.slice(4).map((command) => <SetupCode command={command} key={command} />)}
          </article>
        </section>

        <section className="setup-section" id="applications" aria-labelledby="applications-title">
          <div className="setup-section-heading"><p>05 / applications</p><h2 id="applications-title">Applications</h2></div>
          <article className="preference-group application-list">
            <ul>
              <li>Ableton</li>
              <li>Apple Creator Studio apps</li>
              <li>Anatomy 3D Atlas</li>
              <li>PDFgear</li>
              <li>Todoist</li>
              <li>Typora</li>
              <li>Visual Studio Code</li>
              <li>VLC</li>
              <li>Vuze</li>
            </ul>
          </article>
        </section>
      </main>
      <footer><span>mac setup / one step at a time</span><span>mac / 01</span></footer>
    </div>
  )
}

export default MacSetupPage
