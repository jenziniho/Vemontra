'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const CYCLE = 3800 // ms before the next panel opens on its own

/**
 * A row of tall photo panels. The active one slides open wide and shows its project name;
 * the others narrow and darken. Hovering (or focusing) a panel opens it; otherwise they open one by one.
 */
export default function ProjectPanels({ panels }) {
  const [active, setActive] = useState(0)
  const hovering = useRef(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (panels.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.3 })
    io.observe(rootRef.current)
    const timer = setInterval(() => {
      if (!visible || hovering.current || document.hidden) return
      setActive((a) => (a + 1) % panels.length)
    }, CYCLE)
    return () => { clearInterval(timer); io.disconnect() }
  }, [panels.length])

  return (
    <div
      className="panels"
      ref={rootRef}
      onMouseLeave={() => { hovering.current = false }}
    >
      {panels.map((p, i) => (
        <Link
          key={i}
          href={p.href}
          className={`panel${i === active ? ' is-active' : ''}`}
          onMouseEnter={() => { hovering.current = true; setActive(i) }}
          onFocus={() => setActive(i)}
          aria-label={p.title ? `Project: ${p.title}` : 'Bekijk alle projecten'}
        >
          <img
            src={p.src}
            alt={p.alt || ''}
            style={p.pos ? { objectPosition: p.pos } : undefined}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <span className="panel__shade" aria-hidden="true" />
          <span className="panel__info">
            {p.title ? (
              <>
                {p.subtitle && <span className="panel__sub">{p.subtitle}</span>}
                <span className="panel__title">{p.title}</span>
              </>
            ) : (
              <span className="panel__title">Bekijk onze projecten</span>
            )}
            <span className="panel__go" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}
