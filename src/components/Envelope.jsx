import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WaxSeal from './WaxSeal'
import { PatternDef, Sprig } from './Ornaments'
import { ogeeArch, scallop, toPath } from '../lib/shapes'

/* Scalloped lace edge at the bottom of the envelope */
function EnvelopeBorder() {
  const id = useId().replace(/:/g, '')
  const { greenD, edgeD, innerD } = useMemo(() => {
    const pts = []
    for (let x = -12; x <= 412; x += 1) {
      const t = (x - 200) / 200
      pts.push([x, 104 + 138 * (1 - t * t)])
    }
    const edge = scallop(pts, { lobeLen: 44, amp: 13, closed: false, dir: -1 })
    const inner = scallop(pts, { lobeLen: 44, amp: 13, closed: false, dir: -1, inset: 8 })
    const green = toPath(edge, false) + 'L412 310L-12 310Z'
    return { greenD: green, edgeD: toPath(edge, false), innerD: toPath(inner, false) }
  }, [])

  return (
    <div className="env-border">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <defs>
          <PatternDef id={`ep${id}`} size={58} />
          <linearGradient id={`eg${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#04140c" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d={greenD} fill={`url(#ep${id})`} />
        <path d={greenD} fill={`url(#eg${id})`} />
        <path d={innerD} fill="none" stroke="#b8954a" strokeWidth="0.9" opacity="0.8" />
        <path d={edgeD} fill="none" stroke="#7d6128" strokeWidth="3.2" opacity="0.35" transform="translate(0 2)" />
        <path d={edgeD} fill="none" stroke="#c9a55a" strokeWidth="2" />
        <path d={ogeeArch(200, 232, 34, 304)} fill="#16422f" stroke="#c9a55a" strokeWidth="2" />
        <path d={ogeeArch(200, 244, 25, 304)} fill="#0f3323" stroke="#b8954a" strokeWidth="0.8" opacity="0.9" />
      </svg>
      <Sprig className="env-sprig" style={{ left: '2%', bottom: '62%', width: '17%', transform: 'rotate(-8deg)' }} />
      <Sprig className="env-sprig" style={{ left: '17%', bottom: '42%', width: '15%', transform: 'rotate(-4deg)' }} flip />
      <Sprig className="env-sprig" style={{ left: '33%', bottom: '28%', width: '13%' }} />
      <Sprig className="env-sprig" style={{ left: '43.5%', bottom: '23%', width: '13%' }} />
      <Sprig className="env-sprig" style={{ right: '33%', bottom: '28%', width: '13%' }} flip />
      <Sprig className="env-sprig" style={{ right: '17%', bottom: '42%', width: '15%', transform: 'rotate(4deg)' }} />
      <Sprig className="env-sprig" style={{ right: '2%', bottom: '62%', width: '17%', transform: 'rotate(8deg)' }} flip />
    </div>
  )
}

/* Envelope driven by AI-generated media (image and/or intro video). */
function MediaEnvelope({ media, onOpenStart, onRevealed, onDone }) {
  const [stage, setStage] = useState('idle') // idle → playing → flash → gone
  const video = useRef(null)

  useEffect(() => {
    if (stage !== 'flash') return
    const t1 = setTimeout(() => onRevealed?.(), 700)
    const t2 = setTimeout(() => setStage('gone'), 800)
    return () => (clearTimeout(t1), clearTimeout(t2))
  }, [stage, onRevealed])

  const start = () => {
    if (stage !== 'idle') return
    onOpenStart?.()
    const v = video.current
    if (v) {
      setStage('playing')
      v.play().catch(() => setStage('flash'))
    } else setStage('flash')
  }

  return (
    <AnimatePresence onExitComplete={onDone}>
      {stage !== 'gone' && (
        <motion.div className="envelope" key="media-envelope" exit={{ opacity: 0 }} transition={{ duration: 1.1 }}>
          {media.introVideo ? (
            <video
              ref={video}
              className="env-media"
              src={media.introVideo}
              poster={media.envelopeImage || undefined}
              muted
              playsInline
              preload="auto"
              onEnded={() => setStage('flash')}
            />
          ) : (
            <img className="env-media" src={media.envelopeImage} alt="" />
          )}
          <button type="button" className="env-tap" onClick={start} aria-label="Open the invitation" />
          <motion.p
            className="tap-hint tap-hint-low"
            animate={{ opacity: stage === 'idle' ? [0.5, 1, 0.5] : 0 }}
            transition={stage === 'idle' ? { duration: 2.4, repeat: Infinity } : { duration: 0.3 }}
          >
            Tap to open
          </motion.p>
          <motion.div
            className="env-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'flash' ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
          >
            <div className="rays" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Envelope(props) {
  const m = props.media || {}
  if (m.introVideo || m.envelopeImage) return <MediaEnvelope {...props} media={m} />
  return <CssEnvelope {...props} />
}

/**
 * stage: idle → crack → open → flash → gone
 */
function CssEnvelope({ monogram, onOpenStart, onRevealed, onDone }) {
  const [stage, setStage] = useState('idle')

  useEffect(() => {
    if (stage === 'idle') return
    const timers = []
    if (stage === 'crack') timers.push(setTimeout(() => setStage('open'), 600))
    if (stage === 'open') timers.push(setTimeout(() => setStage('flash'), 1500))
    if (stage === 'flash')
      timers.push(
        setTimeout(() => onRevealed?.(), 900),
        setTimeout(() => setStage('gone'), 1000),
      )
    return () => timers.forEach(clearTimeout)
  }, [stage, onRevealed])

  const start = () => {
    if (stage !== 'idle') return
    onOpenStart?.()
    setStage('crack')
  }

  const opened = stage === 'open' || stage === 'flash' || stage === 'gone'

  return (
    <AnimatePresence onExitComplete={onDone}>
      {stage !== 'gone' && (
        <motion.div
          className="envelope"
          key="envelope"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <div className="env-body paper" />
          <div className="env-inside" />
          <EnvelopeBorder />

          {/* light spilling out of the opening */}
          <motion.div
            className="env-glow"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={opened ? { opacity: 1, scale: stage === 'flash' ? 9 : 2.4 } : { opacity: 0, scale: 0.2 }}
            transition={{ duration: stage === 'flash' ? 1 : 1.4, ease: [0.4, 0, 0.2, 1] }}
          />

          <div className="env-flap-wrap">
            <motion.div
              className="env-flap"
              initial={false}
              animate={opened ? { rotateX: 178 } : { rotateX: 0 }}
              transition={{ duration: 1.5, ease: [0.55, 0.05, 0.25, 1] }}
            >
              <motion.div className="flap-shadow" animate={{ opacity: opened ? 0 : 1 }} transition={{ duration: 0.4 }} />
              <div className="flap-front paper" />
              <div className="flap-back" />
              {opened && <WaxSeal monogram={monogram} part="top" className="seal seal-on-flap" />}
            </motion.div>
          </div>

          {opened ? (
            <motion.div
              className="seal seal-bottom"
              initial={{ y: 0 }}
              animate={{ y: 14, opacity: stage === 'flash' ? 0 : 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <WaxSeal monogram={monogram} part="bottom" />
            </motion.div>
          ) : (
            <motion.button
              type="button"
              className="seal seal-btn"
              onClick={start}
              aria-label="Open the invitation"
              animate={stage === 'crack' ? { x: [0, -3, 3, -2, 2, 0], scale: 0.97 } : { scale: [1, 1.025, 1] }}
              transition={
                stage === 'crack'
                  ? { duration: 0.45 }
                  : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <span className="seal-pulse" />
              <WaxSeal monogram={monogram} part="full" crack={stage === 'crack'} />
            </motion.button>
          )}

          <motion.p
            className="tap-hint"
            animate={{ opacity: stage === 'idle' ? [0.45, 1, 0.45] : 0 }}
            transition={stage === 'idle' ? { duration: 2.4, repeat: Infinity } : { duration: 0.3 }}
          >
            Tap the seal to open
          </motion.p>

          {/* white burst */}
          <motion.div
            className="env-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'flash' ? 1 : 0 }}
            transition={{ duration: 0.7, ease: 'easeIn' }}
          >
            <div className="rays" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
