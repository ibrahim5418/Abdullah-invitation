// Procedural SVG path helpers for the scalloped (Mughal-style) frames.

const fmt = (n) => Math.round(n * 100) / 100

/** Points around an ellipse, starting at the top, clockwise in screen coords. */
export function ellipsePoints(cx, cy, rx, ry, n = 1400) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)])
  }
  return pts
}

/**
 * Turns a polyline into a scalloped outline: every `lobeLen` px of arc length a
 * rounded lobe bulges out along the normal, meeting the next lobe in a sharp cusp.
 * dir = 1 bulges to the left of travel (outward for clockwise closed shapes).
 */
export function scallop(points, { lobeLen = 40, amp = 10, closed = true, dir = 1, inset = 0 } = {}) {
  const n = points.length
  const seg = []
  let total = 0
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = points[i]
    const b = points[(i + 1) % n]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    seg.push(total)
    total += l
  }
  if (!closed) seg.push(total)
  const lobes = Math.max(1, Math.round(total / lobeLen))
  const L = total / lobes

  const out = points.map((p, i) => {
    const prev = points[closed ? (i - 1 + n) % n : Math.max(0, i - 1)]
    const next = points[closed ? (i + 1) % n : Math.min(n - 1, i + 1)]
    let tx = next[0] - prev[0]
    let ty = next[1] - prev[1]
    const tl = Math.hypot(tx, ty) || 1
    tx /= tl
    ty /= tl
    const nx = ty * dir
    const ny = -tx * dir
    const f = (seg[i] % L) / L
    const bump = Math.pow(Math.sin(Math.PI * f), 0.55)
    const off = amp * bump - inset
    return [p[0] + nx * off, p[1] + ny * off]
  })
  return out
}

export function toPath(points, closed = true) {
  let d = `M${fmt(points[0][0])} ${fmt(points[0][1])}`
  for (let i = 1; i < points.length; i++) d += `L${fmt(points[i][0])} ${fmt(points[i][1])}`
  return closed ? d + 'Z' : d
}

/** Pointed ogee / Mughal arch (opening downward), apex at (cx, top). */
export function ogeeArch(cx, top, halfW, baseY) {
  const h = baseY - top
  return [
    `M${cx - halfW} ${baseY}`,
    `L${cx - halfW} ${top + h * 0.62}`,
    `C${cx - halfW} ${top + h * 0.3} ${cx - halfW * 0.22} ${top + h * 0.34} ${cx} ${top}`,
    `C${cx + halfW * 0.22} ${top + h * 0.34} ${cx + halfW} ${top + h * 0.3} ${cx + halfW} ${top + h * 0.62}`,
    `L${cx + halfW} ${baseY}Z`,
  ].join(' ')
}

/** Deterministic pseudo-random for stable decorative jitter. */
export function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
