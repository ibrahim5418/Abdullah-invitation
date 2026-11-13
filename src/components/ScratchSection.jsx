import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'
import { rng } from '../lib/shapes'

function paintFoil(ctx, w, h, title, subtitle) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#a98337')
  g.addColorStop(0.28, '#d8bd72')
  g.addColorStop(0.42, '#efdc9c')
  g.addColorStop(0.58, '#c9a85c')
  g.addColorStop(0.8, '#b08b40')
  g.addColorStop(1, '#8d6a2a')
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // brushed sheen
  const r = rng(11)
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(${r() > 0.5 ? '255,244,205' : '120,88,30'},${0.08 + r() * 0.22})`
    ctx.beginPath()
    ctx.arc(r() * w, r() * h, 0.8 + r() * 2.6, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#2f2a17'
  const big = Math.round(w * 0.058)
  ctx.font = `700 ${big}px Inter, sans-serif`
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(big * 0.06)}px`
  ctx.fillText(title.toUpperCase(), w / 2, h * 0.47)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  ctx.font = `400 ${Math.round(w * 0.033)}px Inter, sans-serif`
  ctx.fillStyle = 'rgba(47,42,23,.8)'
  ctx.fillText(subtitle, w / 2, h * 0.6)
}

function ScratchCard({ title, subtitle, onReveal, children }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const moves = useRef(0)
  const [done, setDone] = useState(false)

  const setup = useCallback(async () => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    try {
      await document.fonts?.ready
    } catch {}
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = wrap.getBoundingClientRect()
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paintFoil(ctx, width, height, title, subtitle)
  }, [title, subtitle])

  useEffect(() => {
    setup()
    const ro = new ResizeObserver(() => !done && setup())
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [setup, done])

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return [e.clientX - rect.left, e.clientY - rect.top]
  }

  const checkCleared = () => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    const { data } = ctx.getImageData(0, 0, c.width, c.height)
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++
      if (data[i] < 40) clear++
    }
    if (clear / total > 0.42) {
      setDone(true)
      onReveal?.()
    }
  }

  const scratch = (e) => {
    if (!drawing.current || done) return
    const ctx = canvasRef.current.getContext('2d')
    const [x, y] = pos(e)
    const w = canvasRef.current.getBoundingClientRect().width
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = Math.max(34, w * 0.11)
    ctx.beginPath()
    const [lx, ly] = last.current || [x - 0.1, y]
    ctx.moveTo(lx, ly)
    ctx.lineTo(x, y)
    ctx.stroke()
    last.current = [x, y]
    if (++moves.current % 8 === 0) checkCleared()
  }

  return (
    <div className="scratch-card" ref={wrapRef}>
      <div className="date-card">{children}</div>
      <motion.canvas
        ref={canvasRef}
        className="scratch-canvas"
        animate={{ opacity: done ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: done ? 'none' : 'auto' }}
        onPointerDown={(e) => {
          drawing.current = true
          last.current = null
          e.currentTarget.setPointerCapture?.(e.pointerId)
          scratch(e)
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          drawing.current = false
          checkCleared()
        }}
        onPointerCancel={() => (drawing.current = false)}
      />
    </div>
  )
}

function Petals({ active }) {
  const petals = useMemo(() => {
    const r = rng(23)
    const colors = ['#2f6b4a', '#4f8a5f', '#c9a85c', '#e8d49b', '#f3ecd9', '#7aa06f']
    return Array.from({ length: 46 }, (_, i) => ({
      left: r() * 100,
      size: 5 + r() * 8,
      delay: r() * 2.4,
      dur: 4.5 + r() * 3.5,
      drift: (r() - 0.5) * 140,
      spin: (r() > 0.5 ? 1 : -1) * (240 + r() * 520),
      color: colors[i % colors.length],
    }))
  }, [])
  if (!active) return null
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.9,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}

export default function ScratchSection({ data }) {
  const s = data.scratch
  const [revealed, setRevealed] = useState(false)
  return (
    <section className="sec sec-green scratch-sec">
      <Petals active={revealed} />
      <div className="section-head is-light">
        <AnimatePresence mode="wait">
          <motion.div
            key={revealed ? 'after' : 'before'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow">{revealed ? s.revealedEyebrow : s.eyebrow}</p>
            <h2 className="section-title">{revealed ? s.revealedTitle : s.title}</h2>
          </motion.div>
        </AnimatePresence>
      </div>
      <Reveal delay={0.15}>
        <ScratchCard title={s.cardTitle} subtitle={s.cardSubtitle} onReveal={() => setRevealed(true)}>
          <div className="date-card-inner">
            <p className="invited">{s.invitedText}</p>
            <p className="date-big">
              {data.date.display.split(', ')[0]},
              <br />
              {data.date.display.split(', ')[1]}
            </p>
            <p className="date-meta">
              {data.date.day} <i>•</i> {data.date.time}
            </p>
          </div>
        </ScratchCard>
      </Reveal>
    </section>
  )
}
