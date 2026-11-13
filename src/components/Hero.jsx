import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GeoPattern, Sprig } from './Ornaments'
import { ellipsePoints, ogeeArch, scallop, toPath } from '../lib/shapes'

const VB_W = 400
const VB_H = 760

function ArchCardSvg() {
  const id = useId().replace(/:/g, '')
  const { outer, rim, inner } = useMemo(() => {
    const base = ellipsePoints(200, 392, 176, 340)
    return {
      outer: toPath(scallop(base, { lobeLen: 46, amp: 13 })),
      rim: toPath(scallop(base, { lobeLen: 46, amp: 13, inset: 7 })),
      inner: toPath(scallop(ellipsePoints(200, 392, 160, 322), { lobeLen: 43, amp: 9 })),
    }
  }, [])

  return (
    <svg className="arch-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true">
      <defs>
        <radialGradient id={`paper${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#f6efe0" />
          <stop offset="0.75" stopColor="#ece2cd" />
          <stop offset="1" stopColor="#ddd0b4" />
        </radialGradient>
        <filter id={`tex${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.16 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`drop${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#020b06" floodOpacity="0.6" />
        </filter>
        <linearGradient id={`gold${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9d08c" />
          <stop offset="0.5" stopColor="#b48d43" />
          <stop offset="1" stopColor="#d9bb72" />
        </linearGradient>
      </defs>

      {/* crown arch at the top */}
      <path d={ogeeArch(200, 6, 62, 120)} fill="#174532" stroke={`url(#gold${id})`} strokeWidth="3" />
      <path d={ogeeArch(200, 26, 44, 120)} fill="#0f3424" stroke="#c9a55a" strokeWidth="1" />

      <g filter={`url(#drop${id})`}>
        <path d={outer} fill={`url(#gold${id})`} />
      </g>
      <path d={rim} fill={`url(#paper${id})`} />
      <path d={rim} fill="#000" filter={`url(#tex${id})`} />
      <path d={inner} fill="none" stroke="#c4a35c" strokeWidth="0.9" opacity="0.75" />
    </svg>
  )
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
})

function ArchText({ data }) {
  const { bride, groom } = data
  return (
    <div className="arch-content">
      <motion.div className="bismillah" {...fade(0.5)}>
        <span className="bis-line" />
        <span lang="ar">{data.bismillah}</span>
        <span className="bis-line" />
      </motion.div>
      <motion.p className="arch-intro" {...fade(0.75)}>
        {data.heroIntro[0]}
        <br />
        {data.heroIntro[1]}
      </motion.p>
      <motion.h1 className="script-name" {...fade(1.0)}>
        {groom.name}
      </motion.h1>
      <motion.p className="parents" {...fade(1.2)}>
        <span>{groom.relation}</span>
        {groom.parents}
      </motion.p>
      <motion.p className="amp" {...fade(1.4)}>
        &amp;
      </motion.p>
      <motion.h1 className="script-name" {...fade(1.6)}>
        {bride.name}
      </motion.h1>
      <motion.p className="parents" {...fade(1.8)}>
        <span>{bride.relation}</span>
        {bride.parents}
      </motion.p>
      <motion.p className="arch-outro" {...fade(2.05)}>
        {data.heroOutro[0]}
        <br />
        {data.heroOutro[1]}
      </motion.p>
    </div>
  )
}

const settle = {
  initial: { opacity: 0, scale: 1.06 },
  transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
}

export default function Hero({ data, revealed, nudging }) {
  const heroImage = data.media?.heroImage
  return (
    <section className={`hero ${heroImage ? 'hero--image' : ''}`} id="top">
      {heroImage ? (
        <>
          {/* blurred copy fills any space the card image can't cover */}
          <img className="hero-backdrop" src={heroImage} alt="" aria-hidden="true" />
          <motion.div className="hero-art" {...settle} animate={revealed ? { opacity: 1, scale: 1 } : {}}>
            <img className="hero-art-img" src={heroImage} alt="" />
            {revealed && <ArchText data={data} />}
          </motion.div>
        </>
      ) : (
        <>
          <GeoPattern className="hero-bg" size={52} />
          <svg className="hero-bottom-arch" viewBox="0 0 120 90" aria-hidden="true">
            <path d={ogeeArch(60, 4, 52, 92)} fill="#174532" stroke="#c9a55a" strokeWidth="2" />
            <path d={ogeeArch(60, 16, 40, 92)} fill="#0e3122" stroke="#b8954a" strokeWidth="0.8" />
          </svg>
          <motion.div className="arch-card" {...settle} animate={revealed ? { opacity: 1, scale: 1 } : {}}>
            <ArchCardSvg />
            <div className="arch-florals" aria-hidden="true">
              <Sprig className="af af-tl" />
              <Sprig className="af af-tr" flip />
              <Sprig className="af af-ml" />
              <Sprig className="af af-mr" flip />
              <Sprig className="af af-bl" flip />
              <Sprig className="af af-br" />
              <Sprig className="af af-bc" />
            </div>
            {revealed && <ArchText data={data} />}
          </motion.div>
        </>
      )}

      <motion.button
        type="button"
        className={`scroll-hint ${nudging ? 'is-bouncing' : ''}`}
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 2.6, duration: 1 }}
        onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down for details"
      >
        <span>Scroll down</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </section>
  )
}
