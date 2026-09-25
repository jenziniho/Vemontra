'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav } from '@/lib/site'

const isOn = (pathname, href) => pathname === href || pathname.startsWith(href + '/')

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the phone menu whenever the page changes
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Vemontra — home">
          <img src="/assets/logo.webp" alt="Vemontra bv — industriële oplossingen, van A tot Z" width="934" height="158" />
        </Link>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mainNav"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
        {/* On phones the nav is only shown when the menu is open (CSS hides the button on desktop) */}
        <nav className={`nav${open ? ' is-open' : ''}`} id="mainNav">
          {nav.map((item) => {
            const active = isOn(pathname, item.href) || item.children?.some((c) => isOn(pathname, c.href))
            if (!item.children) {
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </Link>
              )
            }
            return (
              <div className="nav__group" key={item.href}>
                <Link href={item.href} aria-current={active ? 'page' : undefined} className="nav__parent">
                  {item.label}
                  <svg className="nav__caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
                </Link>
                <div className="nav__sub">
                  {item.children.map((c) => (
                    <Link key={c.href + c.label} href={c.href} aria-current={pathname === c.href ? 'page' : undefined}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
