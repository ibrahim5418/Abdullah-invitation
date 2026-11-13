import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal, { SectionHead } from './Reveal'
import { Divider } from './Ornaments'

/* ── With joyful hearts ── */
export function Welcome({ data }) {
  return (
    <section className="sec sec-cream welcome" id="details">
      <Reveal as="h2" className="section-title">
        {data.welcome.title}
      </Reveal>
      <Reveal as="p" className="lead" delay={0.15}>
        {data.welcome.text}
      </Reveal>
      <Reveal delay={0.3}>
        <Divider />
      </Reveal>
    </section>
  )
}

/* ── Countdown ── */
function diff(target) {
  const ms = Math.max(0, target - Date.now())
  return {
    done: ms === 0,
    Days: Math.floor(ms / 864e5),
    Hours: Math.floor(ms / 36e5) % 24,
    Minutes: Math.floor(ms / 6e4) % 60,
    Seconds: Math.floor(ms / 1e3) % 60,
  }
}

export function Countdown({ data }) {
  const target = new Date(data.date.iso).getTime()
  const [t, setT] = useState(() => diff(target))
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return (
    <section className="sec sec-cream countdown">
      <SectionHead eyebrow={data.countdown.eyebrow} title={data.countdown.title} />
      <Reveal className="cd-grid" delay={0.15}>
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((k) => (
          <div className="cd-cell" key={k}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={t[k]}
                className="cd-num"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {String(t[k]).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="cd-label">{k}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

/* ── Timeline ── */
export function Schedule({ data }) {
  return (
    <section className="sec sec-beige schedule">
      <SectionHead eyebrow={data.date.short} title={data.schedule.title} />
      <ol className="timeline">
        <motion.span
          className="tl-line"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
        {data.schedule.items.map((it, i) => (
          <Reveal as="li" key={i} className="tl-item" delay={i * 0.08} y={18}>
            <span className="tl-dot">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="tl-time">{it.time}</p>
              <h3 className="tl-title">{it.title}</h3>
              <p className="tl-text">{it.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ── Venue ── */
export function Venue({ data }) {
  const v = data.venues
  return (
    <section className="sec venue">
      <div className="venue-rings" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
      <SectionHead eyebrow={v.eyebrow} title={v.title} light />
      {v.items.map((it, i) => (
        <div className="venue-block" key={i}>
          {i > 0 && (
            <Reveal>
              <Divider className="venue-divider" />
            </Reveal>
          )}
          <Reveal as="p" className="venue-label" delay={0.1}>
            {it.label} <i>•</i> {it.time}
          </Reveal>
          <Reveal as="h3" className="venue-name" delay={0.18}>
            {it.name}
          </Reveal>
          {it.address && (
            <Reveal as="p" className="venue-address" delay={0.25}>
              {it.address}
            </Reveal>
          )}
          <Reveal delay={0.3}>
            <a className="pill-btn" href={it.mapUrl} target="_blank" rel="noreferrer">
              View on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
      ))}
    </section>
  )
}

/* ── Your presence is our present ── */
export function Presence({ data }) {
  return (
    <section className="sec sec-cream presence">
      <Reveal className="heart-ring">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      </Reveal>
      <Reveal as="h2" className="section-title" delay={0.1}>
        {data.presence.title}
      </Reveal>
      <Reveal as="p" className="lead" delay={0.2}>
        {data.presence.text}
      </Reveal>
    </section>
  )
}

/* ── Closing ── */
export function Closing({ data }) {
  return (
    <section className="sec closing">
      <svg className="closing-arches" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-40 600 L-40 300 C-40 120 120 110 200 20 C280 110 440 120 440 300 L440 600" />
        <path d="M0 600 L0 320 C0 160 140 150 200 70 C260 150 400 160 400 320 L400 600" />
      </svg>
      <Reveal as="h2" className="section-title">
        {data.closing.title}
      </Reveal>
      <Reveal as="p" className="lead" delay={0.15}>
        {data.closing.text}
      </Reveal>
      <Reveal className="closing-names" delay={0.25}>
        <p>{data.groom.name}</p>
        <p className="amp-gold">&amp;</p>
        <p>{data.bride.name}</p>
      </Reveal>
      <Reveal as="p" className="closing-date" delay={0.35}>
        {data.date.display}
      </Reveal>
      <Reveal delay={0.45}>
        <button
          type="button"
          className="back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to the beginning ↑
        </button>
      </Reveal>
    </section>
  )
}
