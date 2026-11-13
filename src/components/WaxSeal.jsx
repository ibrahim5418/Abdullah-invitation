import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'

// Irregular wax blob outline
function waxEdge(cx, cy, r) {
  const n = 120
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const k = 1 + 0.028 * Math.sin(5 * a + 0.6) + 0.018 * Math.sin(11 * a + 2.1) + 0.01 * Math.sin(23 * a)
    const x = cx + r * k * Math.cos(a)
    const y = cy + r * k * Math.sin(a)
    d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2)
  }
  return d + 'Z'
}

// Laurel leaves along the left arc
function laurel(cx, cy, r) {
  const leaves = []
  const from = (115 * Math.PI) / 180
  const to = (250 * Math.PI) / 180
  const n = 11
  for (let i = 0; i < n; i++) {
    const a = from + ((to - from) * i) / (n - 1)
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    const tangent = (a * 180) / Math.PI + 90
    const s = 0.75 + 0.35 * Math.sin((i / (n - 1)) * Math.PI)
    leaves.push({ x, y, rot: tangent - 35, s })
    leaves.push({ x, y, rot: tangent + 35 + 180, s: s * 0.9 })
  }
  return leaves
}

// Jagged split line across the seal (top / bottom halves)
const CRACK_Y = [96, 102, 97, 104, 99, 103, 98]
function halfClip(top) {
  const pts = CRACK_Y.map((y, i) => [i * (200 / (CRACK_Y.length - 1)), y])
  const line = pts.map(([x, y]) => `${x} ${y}`).join('L')
  return top ? `M0 0L200 0L200 ${pts.at(-1)[1]}L${[...pts].reverse().map(([x, y]) => `${x} ${y}`).join('L')}Z` : `M0 200L0 ${pts[0][1]}L${line}L200 200Z`
}

export default function WaxSeal({ monogram = 'F&I', part = 'full', crack = false, className = '', style }) {
  const uid = useId().replace(/:/g, '')
  const edge = useMemo(() => waxEdge(100, 100, 92), [])
  const leaves = useMemo(() => laurel(100, 100, 56), [])
  const clip = part === 'full' ? null : halfClip(part === 'top')
  const fs = monogram.length > 3 ? 34 : 42

  return (
    <svg className={className} style={style} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id={`wax${uid}`} cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#f0d894" />
          <stop offset="35%" stopColor="#c9a456" />
          <stop offset="75%" stopColor="#9a7633" />
          <stop offset="100%" stopColor="#6b4f1d" />
        </radialGradient>
        <radialGradient id={`face${uid}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#d9bc70" />
          <stop offset="60%" stopColor="#b48f45" />
          <stop offset="100%" stopColor="#8b6a2c" />
        </radialGradient>
        <linearGradient id={`rim${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff1c2" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#a9853d" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4a3510" stopOpacity="0.9" />
        </linearGradient>
        <filter id={`sh${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#3b2a0c" floodOpacity="0.45" />
        </filter>
        <filter id={`grain${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.08  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        {clip && (
          <clipPath id={`clip${uid}`}>
            <path d={clip} />
          </clipPath>
        )}
      </defs>

      <g clipPath={clip ? `url(#clip${uid})` : undefined}>
        <g filter={`url(#sh${uid})`}>
          <path d={edge} fill={`url(#wax${uid})`} />
        </g>
        <path d={edge} fill="#000" filter={`url(#grain${uid})`} opacity="0.5" />
        {/* raised rim */}
        <circle cx="100" cy="100" r="74" fill="none" stroke={`url(#rim${uid})`} strokeWidth="7" />
        <circle cx="100" cy="100" r="70" fill={`url(#face${uid})`} />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#5f4517" strokeOpacity="0.45" strokeWidth="1.2" />

        {/* laurel */}
        <g>
          {leaves.map((l, i) => (
            <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}>
              <path d="M0 0 C3 -4 3.5 -9 0 -14 C-3.5 -9 -3 -4 0 0Z" fill="#fff0c0" opacity="0.55" transform="translate(0.7 0.7)" />
              <path d="M0 0 C3 -4 3.5 -9 0 -14 C-3.5 -9 -3 -4 0 0Z" fill="#7a5a22" />
            </g>
          ))}
          <path
            d={`M${100 + 56 * Math.cos(2.0)} ${100 + 56 * Math.sin(2.0)} A56 56 0 0 1 ${100 + 56 * Math.cos(4.36)} ${100 + 56 * Math.sin(4.36)}`}
            fill="none"
            stroke="#6a4c1a"
            strokeWidth="1.3"
          />
        </g>

        {/* embossed monogram */}
        <text
          x="112"
          y="114"
          textAnchor="middle"
          fontFamily="'Bodoni Moda', serif"
          fontSize={fs}
          fontWeight="500"
          fill="#fff3c9"
          opacity="0.7"
          transform="translate(1.2 1.4)"
        >
          {monogram}
        </text>
        <text x="112" y="114" textAnchor="middle" fontFamily="'Bodoni Moda', serif" fontSize={fs} fontWeight="500" fill="#5c4214">
          {monogram}
        </text>

        {/* specular highlight */}
        <ellipse cx="72" cy="58" rx="34" ry="16" fill="#fff8de" opacity="0.18" transform="rotate(-30 72 58)" />
      </g>

      {crack && part === 'full' && (
        <motion.path
          d="M104 8 L98 36 L106 58 L97 84 L104 104 L96 128 L103 152 L97 176 L101 194"
          fill="none"
          stroke="#3d2b0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      )}
    </svg>
  )
}
