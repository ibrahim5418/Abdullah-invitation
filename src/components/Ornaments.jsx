import { useId } from 'react'

/* ── Islamic 8-fold star lattice (gold strapwork on emerald) ── */
function starPath(cx, cy, r, rot = Math.PI / 8) {
  const p = Array.from({ length: 8 }, (_, i) => {
    const a = rot + (i * Math.PI) / 4
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
  const order = [0, 3, 6, 1, 4, 7, 2, 5]
  return 'M' + order.map((i) => `${p[i][0].toFixed(2)} ${p[i][1].toFixed(2)}`).join('L') + 'Z'
}
function octagon(cx, cy, r, rot = Math.PI / 8) {
  return (
    'M' +
    Array.from({ length: 8 }, (_, i) => {
      const a = rot + (i * Math.PI) / 4
      return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`
    }).join('L') +
    'Z'
  )
}

export function PatternDef({ id, size = 84, bg = '#123b2a', gold = '#b8954a' }) {
  const S = size
  const R = S * 0.5
  const centers = [
    [0, 0],
    [S, 0],
    [0, S],
    [S, S],
    [S / 2, S / 2],
  ]
  const d =
    centers.map(([x, y]) => starPath(x, y, R)).join(' ') +
    ' ' +
    centers.map(([x, y]) => octagon(x, y, R * 0.38)).join(' ')
  return (
    <pattern id={id} width={S} height={S} patternUnits="userSpaceOnUse">
      <rect width={S} height={S} fill={bg} />
      <path d={d} fill="none" stroke="#0a2318" strokeWidth="5" strokeLinejoin="round" opacity="0.55" />
      <path d={d} fill="none" stroke={gold} strokeWidth="2.6" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#f3dc9a" strokeWidth="0.7" strokeLinejoin="round" opacity="0.55" />
    </pattern>
  )
}

export function GeoPattern({ size = 84, className = '', bg = '#123b2a', gold = '#b8954a', glow = true }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <PatternDef id={`p${id}`} size={size} bg={bg} gold={gold} />
        <radialGradient id={`v${id}`} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#020c07" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#p${id})`} />
      {glow && <rect width="100%" height="100%" fill={`url(#v${id})`} />}
    </svg>
  )
}

/* ── Gold floral sprig (line art) ── */
function Flower({ x, y, r = 4.2, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.55} ry={r} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.32} fill="currentColor" stroke="none" />
    </g>
  )
}
function Leaf({ x, y, rot, s = 1 }) {
  return (
    <path
      d="M0 0 C3 -4 4 -10 0 -16 C-4 -10 -3 -4 0 0Z M0 -1 L0 -13"
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
    />
  )
}

export function Sprig({ className = '', style, flip = false }) {
  return (
    <span className={className} style={{ display: 'block', ...style }}>
    <svg
      width="100%"
      style={{ display: 'block', aspectRatio: '80 / 150', height: 'auto' }}
      viewBox="0 0 80 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g transform={flip ? 'translate(80 0) scale(-1 1)' : undefined}>
        <path d="M40 148 C39 120 36 96 40 70 C43 50 40 30 41 12" />
        <path d="M39 112 C30 106 22 100 16 88" />
        <path d="M40 92 C50 86 58 78 62 66" />
        <path d="M40 60 C32 54 27 46 25 36" />
        <path d="M41 44 C48 40 52 33 54 26" />
        <Leaf x={39} y={130} rot={-38} />
        <Leaf x={40} y={122} rot={34} />
        <Leaf x={28} y={103} rot={-62} s={0.85} />
        <Leaf x={22} y={95} rot={-20} s={0.8} />
        <Leaf x={50} y={85} rot={58} s={0.85} />
        <Leaf x={57} y={76} rot={20} s={0.8} />
        <Leaf x={39} y={78} rot={-30} s={0.8} />
        <Leaf x={31} y={50} rot={-50} s={0.75} />
        <Leaf x={49} y={36} rot={50} s={0.7} />
        <Flower x={16} y={86} r={4.4} />
        <Flower x={62} y={63} r={4.6} rot={20} />
        <Flower x={41} y={9} r={5} />
        <Flower x={25} y={33} r={3.6} rot={12} />
        <Flower x={55} y={23} r={3.4} rot={-8} />
        <circle cx="33" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="47" cy="16" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="20" cy="72" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="66" cy="50" r="1.2" fill="currentColor" stroke="none" />
      </g>
    </svg>
    </span>
  )
}

/* ── 4-point sparkle star ── */
export function Sparkle({ size = 14, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" fill="currentColor" />
    </svg>
  )
}

export function Divider({ className = '' }) {
  return (
    <div className={`divider ${className}`} aria-hidden="true">
      <span />
      <Sparkle size={12} />
      <span />
    </div>
  )
}
