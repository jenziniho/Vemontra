'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Slide animations: every element with data-reveal="left" or data-reveal="right" slides in from that side when it
 * scrolls into view, and slides back out once it has left the screen completely — so it plays again in both
 * directions, scrolling down and scrolling up.
 * The hidden starting position only applies when JavaScript runs (the "js" class on <html>), so without it
 * everything is simply visible.
 */
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // In: at least 12% visible. Out: only when fully off-screen (avoids flicker at the edge).
          if (e.isIntersecting && e.intersectionRatio >= 0.12) e.target.classList.add('is-in')
          else if (!e.isIntersecting) e.target.classList.remove('is-in')
        }
      },
      { threshold: [0, 0.12] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
