import { useEffect, useRef } from 'react'
import './App.css'

function ReactiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let width = 0
    let height = 0
    let pointer = { x: -500, y: -500 }
    let current = { x: -500, y: -500 }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY } }
    const leave = () => { pointer = { x: -500, y: -500 } }
    const bend = (x: number, y: number) => {
      const dx = x - current.x
      const dy = y - current.y
      const distance = Math.hypot(dx, dy)
      const influence = Math.max(0, 1 - distance / 310) ** 2 * 32
      return distance ? { x: x + (dx / distance) * influence, y: y + (dy / distance) * influence } : { x, y }
    }

    const draw = () => {
      current.x += (pointer.x - current.x) * 0.1
      current.y += (pointer.y - current.y) * 0.1
      context.clearRect(0, 0, width, height)
      context.strokeStyle = 'rgba(235, 238, 237, 0.115)'
      context.lineWidth = 1
      const gap = 78

      for (let x = -gap; x < width + gap; x += gap) {
        context.beginPath()
        for (let y = -gap; y < height + gap; y += 20) {
          const point = bend(x, y)
          if (y === -gap) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.stroke()
      }
      for (let y = -gap; y < height + gap; y += gap) {
        context.beginPath()
        for (let x = -gap; x < width + gap; x += 20) {
          const point = bend(x, y)
          if (x === -gap) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.stroke()
      }

      const glow = context.createRadialGradient(current.x, current.y, 0, current.x, current.y, 45)
      glow.addColorStop(0, 'rgba(255, 255, 255, .88)')
      glow.addColorStop(0.08, 'rgba(255, 255, 255, .88)')
      glow.addColorStop(0.2, 'rgba(225, 239, 235, .22)')
      glow.addColorStop(1, 'rgba(225, 239, 235, 0)')
      context.fillStyle = glow
      context.beginPath()
      context.arc(current.x, current.y, 45, 0, Math.PI * 2)
      context.fill()
      frame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <canvas className="reactive-grid" ref={canvasRef} aria-hidden="true" />
}

function App() {
  return (
    <div className="site">
      <ReactiveGrid />
      <header>
        <a className="brand" href="#top">routines</a>
        <p>personal reference / 2026</p>
        <nav aria-label="Collections"><a href="#recipes">01 recipes</a><a href="#commands">02 commands</a><a href="#setup">03 setup</a></nav>
      </header>

      <main id="top">
        <div className="intro-meta"><span>home</span><span>quiet systems for everyday life</span></div>
        <h1>routines<br /><em>for real life.</em></h1>
        <div className="intro-bottom">
          <p>A growing archive of recipes, Mac rituals, and the small things worth writing down once.</p>
          <a href="#collections">enter archive <span>↘</span></a>
        </div>
      </main>

      <section className="collection-list" id="collections" aria-label="Collections">
        <a id="recipes" href="#recipes"><span>01</span><strong>Recipes</strong><small>the familiar things you make</small><b>↗</b></a>
        <a id="commands" href="#commands"><span>02</span><strong>Mac commands</strong><small><code>yt-dlp</code> · PDFs · files · shortcuts</small><b>↗</b></a>
        <a id="setup" href="#setup"><span>03</span><strong>Fresh Mac setup</strong><small>from clean slate to yours</small><b>↗</b></a>
      </section>

      <footer><span>move your cursor</span><span>routines / 01—03</span></footer>
    </div>
  )
}

export default App
