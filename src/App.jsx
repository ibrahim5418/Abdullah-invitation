import { useCallback, useEffect, useState } from 'react'
import { invitation as data } from './config'
import Envelope from './components/Envelope'
import Hero from './components/Hero'
import ScratchSection from './components/ScratchSection'
import { Closing, Countdown, Presence, Schedule, Venue, Welcome } from './components/Sections'

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [envelopeGone, setEnvelopeGone] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('locked', !envelopeGone)
  }, [envelopeGone])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Once the intro video has completely finished (envelope gone, name card
  // on screen), wait BOUNCE_DELAY, then bounce the page once for
  // BOUNCE_LENGTH so guests know there is more below. If they scroll
  // before or during it, the bounce is skipped / stopped.
  const INTRO_FADE = 1100 // envelope fade-out after the video ends (see Envelope.jsx)
  const BOUNCE_DELAY = 10000
  const BOUNCE_LENGTH = 10000 // 5 bounces of 2s each (see .column.is-nudging)
  const [nudging, setNudging] = useState(false)
  useEffect(() => {
    if (!revealed) return
    let stopTimer
    const stop = () => {
      setNudging(false)
      clearTimeout(startTimer)
      clearTimeout(stopTimer)
      off()
    }
    const onScroll = () => window.scrollY > 8 && stop()
    const off = () => {
      window.removeEventListener('scroll', onScroll)
    }
    const startTimer = setTimeout(() => {
      if (window.scrollY > 8) return off()
      setNudging(true)
      stopTimer = setTimeout(stop, BOUNCE_LENGTH)
    }, INTRO_FADE + BOUNCE_DELAY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(startTimer)
      clearTimeout(stopTimer)
      off()
    }
  }, [revealed])

  const onRevealed = useCallback(() => setRevealed(true), [])
  const onDone = useCallback(() => setEnvelopeGone(true), [])

  return (
    <div className="stage">
      <main className={`column ${nudging ? 'is-nudging' : ''}`}>
        <Hero data={data} revealed={revealed} nudging={nudging} />
        {revealed && (
          <>
            <Welcome data={data} />
            <ScratchSection data={data} />
            <Countdown data={data} />
            <Schedule data={data} />
            <Venue data={data} />
            <Presence data={data} />
            <Closing data={data} />
          </>
        )}
      </main>

      {!envelopeGone && (
        <Envelope monogram={data.monogram} media={data.media} onRevealed={onRevealed} onDone={onDone} />
      )}
    </div>
  )
}
