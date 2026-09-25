'use client'

import { useEffect, useRef } from 'react'

/**
 * "Ons bouwproces" — the scroll-locked video with four phase bars.
 *
 * How it works: when the visitor reaches this section, the page locks and the VIDEO becomes the clock.
 * It plays natively (no seeking, so it stays smooth), and the page's scroll position follows the video.
 *  - Scrolling down (wheel, touch, keys) raises the playback speed; scrolling up rewinds a little.
 *  - Dragging the scrollbar scrubs the video; letting go resumes playback from there.
 *  - When the video ends, the page releases and normal scrolling continues.
 *  - "Overslaan" (or the Esc key) skips straight past the section.
 *
 * To change the phases, edit PHASE_LABELS. Each phase gets an equal share of the video's length.
 */
const PHASE_LABELS = [
  'Grondwerken en fundering storten',
  'Funderingen en vloerplaat',
  'Montage van de hoofdconstructie',
  'Gevels en dak',
]
const MAX_RATE = 5

export default function ProcessVideo({ src = '/assets/bouwproces.mp4' }) {
  const pinRef = useRef(null)
  const videoRef = useRef(null)
  const barsRef = useRef(null)
  const labelsRef = useRef(null)
  const skipRef = useRef(() => {})

  useEffect(() => {
    const pin = pinRef.current
    const video = videoRef.current
    const barsBox = barsRef.current
    const bars = Array.from(barsBox.querySelectorAll('.bar i'))
    const labels = Array.from(labelsRef.current.querySelectorAll('span'))
    const PHASES = labels.length
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let DUR = 20
    let locked = false, done = false, boost = 0, lastP = -1, lastPhase = 0, ready = false, pendingSeek = null
    let clock = 0, lastVt = -1, lastTs = 0, expectedY = -1, dragUntil = 0, touchY = null, raf = 0
    let cameFromAbove = false // only take over when the visitor scrolls into the section from above

    const clamp01 = (x) => Math.min(1, Math.max(0, x))
    const pinTop = () => pin.getBoundingClientRect().top + window.pageYOffset
    const scrollRange = () => pin.offsetHeight - window.innerHeight

    function paint(p) {
      if (p === lastP) return
      lastP = p
      for (let i = 0; i < PHASES; i++) bars[i].style.setProperty('--p', clamp01(p * PHASES - i).toFixed(4))
      const phase = Math.min(PHASES - 1, Math.floor(p * PHASES))
      if (phase !== lastPhase || !labels[phase].classList.contains('is-active')) {
        labels.forEach((l, i) => {
          l.classList.toggle('is-active', i === phase)
          l.classList.toggle('is-past', i < phase)
        })
        lastPhase = phase
      }
      barsBox.setAttribute('aria-valuenow', (p * DUR).toFixed(1))
      pin.classList.toggle('is-done', p >= 0.999)
    }
    function play() {
      if (video.paused) video.play()?.catch(() => {})
    }
    // Never pile seeks up: one at a time, the newest wins
    function seek(t) {
      t = Math.min(Math.max(0, t), Math.max(0, DUR - 0.05))
      if (video.seeking) { pendingSeek = t; return }
      try { video.currentTime = t } catch {}
    }
    function lock() {
      locked = true; boost = 0; clock = video.currentTime || 0; lastVt = -1
      document.documentElement.style.overscrollBehavior = 'none'
    }
    function unlock() {
      locked = false; video.playbackRate = 1
      document.documentElement.style.overscrollBehavior = ''
    }
    function finish() {
      if (!locked) return
      done = true; unlock(); video.pause()
      window.scrollTo(0, pinTop() + scrollRange())
    }

    // Skip: jump to the end of the section and continue scrolling normally
    skipRef.current = () => {
      if (!locked) lock()
      clock = DUR
      paint(1)
      finish()
    }

    function frame(ts) {
      raf = requestAnimationFrame(frame)
      const dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0
      lastTs = ts
      const rect = pin.getBoundingClientRect()
      const range = scrollRange()
      if (range <= 0) return

      if (rect.top > 2) {
        // Above the section: reset and re-arm
        if (locked) unlock()
        done = false
        cameFromAbove = true
        if (!video.paused) video.pause()
        if (video.currentTime > 0.05) seek(0)
        clock = 0
        paint(0)
        return
      }
      // Entered by scrolling down from above → take control. Landing inside or below the section some other
      // way (a link, a page refresh, the End key, a big jump) doesn't lock: the video then just follows the scroll.
      if (!locked && !done && !reduce) {
        // (landing exactly at the start, e.g. via the "Ons bouwproces" link, also plays it)
        if ((cameFromAbove && -rect.top < window.innerHeight * 0.5) || Math.abs(rect.top) <= 2) lock()
        else done = true
      }
      cameFromAbove = false

      if (locked) {
        if (document.visibilityState === 'visible' && ready) {
          if (video.paused && Math.abs(video.currentTime - clock) > 0.25) seek(clock)
          play()
        }
        boost *= 0.92 // speed boost from scrolling decays back to 1×
        if (boost < 0.02) boost = 0
        const rate = 1 + boost
        if (Math.abs(video.playbackRate - rate) > 0.05) video.playbackRate = rate

        // The video is the clock whenever it's actually advancing; if it stalls (buffering,
        // failed to load) a fallback clock keeps the section moving so the page never gets stuck.
        const vt = video.currentTime
        if (ready && !video.paused && !video.seeking && vt !== lastVt) clock = vt
        else clock = Math.min(DUR, clock + dt * rate)
        lastVt = vt

        if (performance.now() < dragUntil) {
          // The visitor is dragging the scrollbar: scrub to follow it
          clock = clamp01(-rect.top / range) * DUR
          if (!video.paused) video.pause()
          if (ready && Math.abs(video.currentTime - clock) > 0.12) seek(clock)
          lastVt = -1
          paint(clamp01(clock / DUR))
          if (rect.bottom <= window.innerHeight + 2) finish()
          return
        }
        const p = clamp01(clock / DUR)
        expectedY = Math.round(pinTop() + p * range)
        window.scrollTo(0, expectedY) // the page follows the video
        paint(p)
        if (clock >= DUR - 0.08) finish()
      } else {
        // Released (finished, or reduced motion): scrub by scroll position, no auto playback
        const q = clamp01(-rect.top / range)
        paint(q)
        if (!video.paused) video.pause()
        if (ready && Math.abs(video.currentTime - q * DUR) > 0.12) seek(q * DUR)
      }
    }

    // While locked, the visitor's scrolling drives playback speed (down) or a rewind (up)
    function userScroll(delta) {
      if (!locked) return false
      if (delta > 0) boost = Math.min(MAX_RATE - 1, boost + delta / 120)
      else if (delta < 0) {
        boost = 0
        clock = Math.max(0, clock + delta / 200)
        seek(clock)
      }
      return true
    }

    // ---- event handlers (all removed again on unmount) ----
    const onMeta = () => { if (isFinite(video.duration) && video.duration > 0) DUR = video.duration }
    const onCanPlay = () => { ready = true }
    const onEnded = () => finish()
    const onSeeked = () => {
      if (pendingSeek !== null) { const t = pendingSeek; pendingSeek = null; seek(t) }
    }
    // Any scroll we didn't cause ourselves (scrollbar drag, autoscroll, find-in-page…)
    const onScroll = () => {
      if (locked && Math.abs(window.pageYOffset - expectedY) > 3) dragUntil = performance.now() + 160
    }
    const onWheel = (e) => { if (userScroll(e.deltaY)) e.preventDefault() }
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (touchY === null) return
      const dy = touchY - e.touches[0].clientY
      touchY = e.touches[0].clientY
      if (userScroll(dy * 1.5)) e.preventDefault()
    }
    const onKey = (e) => {
      if (!locked) return
      if (e.key === 'Escape') { skipRef.current(); e.preventDefault(); return }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { userScroll(120); e.preventDefault() }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { userScroll(-120); e.preventDefault() }
    }
    const onVisibility = () => { if (document.hidden && !video.paused) video.pause() }

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('ended', onEnded)
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)

    // On upright phones the block is only as tall as its content; centre it on the screen while it's pinned.
    const inner = pin.querySelector('.pin__inner')
    const portrait = window.matchMedia('(orientation: portrait)')
    const placeInner = () => {
      const top = portrait.matches ? Math.max(0, (window.innerHeight - inner.offsetHeight) / 2) : 0
      inner.style.setProperty('--pin-top', `${Math.round(top)}px`)
    }
    placeInner()
    window.addEventListener('resize', placeInner)
    document.addEventListener('visibilitychange', onVisibility)

    // The video may already be loaded by the time this runs
    onMeta()
    if (video.readyState >= 3) ready = true
    raf = requestAnimationFrame(frame)
    paint(0)

    return () => {
      cancelAnimationFrame(raf)
      unlock()
      skipRef.current = () => {}
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', placeInner)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <section className="process" id="proces" aria-label="Ons bouwproces">
      <div className="pin" ref={pinRef} style={{ '--pin-len': 400 }}>
        <div className="pin__inner">
          <h2 className="process__title" data-reveal="left">Ons bouwproces, van zand naar kwaliteit.</h2>
          <div className="stage" data-reveal="left" style={{ '--reveal-delay': '.12s' }}>
            <video ref={videoRef} src={src} muted playsInline preload="auto" aria-label="Bouwproces in vier fases" />
            <div className="stage__hint">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M8 2v11M3 8l5 5 5-5" />
              </svg>
              Scroll om te versnellen
            </div>
            <button type="button" className="stage__skip" onClick={() => skipRef.current()}>
              Overslaan
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l6 5-6 5M9 3l5 5-5 5" /></svg>
            </button>
          </div>
          <div className="phase" data-reveal="left" style={{ '--reveal-delay': '.24s' }}>
            <div className="phase__label" ref={labelsRef} aria-live="polite">
              {PHASE_LABELS.map((label, i) => (
                <span key={label} className={i === 0 ? 'is-active' : undefined}>
                  <b>Fase {i + 1}:</b>
                  {label}
                </span>
              ))}
            </div>
            <div
              className="bars"
              ref={barsRef}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={20}
              aria-valuenow={0}
              aria-label="Voortgang van de video"
            >
              {PHASE_LABELS.map((label, i) => (
                <div className="bar" data-n={`FASE ${i + 1}`} key={label}>
                  <i />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
