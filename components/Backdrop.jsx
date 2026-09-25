'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * The background behind every page (below the hero): a faint construction-drawing grid, soft copper light,
 * and line drawings of steel structures that drift a little slower than the page, which gives depth.
 * Everything is drawn in code (no images), stays behind the content and never catches clicks.
 *
 * To change the look: colours/opacity in app/globals.css (search "Backdrop"), the drawings below,
 * and STEP (the distance between two drawings, in pixels).
 */
const STEP = 850
const ORDER = ['hall', 'crane', 'truss', 'axes']
const RATIO = { hall: 420 / 660, crane: 540 / 440, truss: 170 / 1020, axes: 420 / 520 } // height / width
// What the drawings should stay clear of: text (weighs most) and solid blocks like photos and forms (they simply cover a drawing)
const TEXT = 'h1, h2, h3, h4, p, li, dt, dd, label, legend, small, span, a, strong, .btn, .eyebrow, .site-header .wrap'
const SOLID = 'img, video, form, .tile, .panels, .pcard, .fcard, .tfilter, .facts, .gallery, .pin'

export default function Backdrop() {
  const ref = useRef(null)
  const pathname = usePathname()
  const [slots, setSlots] = useState([])

  // Place a drawing roughly every STEP pixels, from below the hero to above the footer. Each one picks the
  // nearby spot (either side, a bit higher or lower) that overlaps the text, photos and forms the least.
  useEffect(() => {
    const host = ref.current?.parentElement
    if (!host) return
    let last = ''
    const measure = () => {
      const vw = host.clientWidth
      const phone = vw <= 860
      // Positions without transforms (the slide-in animations move content sideways until it's on screen)
      const place = (el) => {
        let x = 0, y = 0, e = el
        while (e && e !== host) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent }
        return { l: x - 24, r: x + el.offsetWidth + 24, t: y - 24, b: y + el.offsetHeight + 24 }
      }
      const hostBox = host.getBoundingClientRect()
      const visible = (el) => !el.closest('.backdrop, .footer, .pin') && el.offsetParent !== null
      // Solid blocks: their whole box
      const solids = Array.from(host.querySelectorAll(SOLID)).filter((el) => el.matches('.pin') || visible(el))
        .map((el) => ({ ...place(el), weight: el.matches('.pin') ? 1 : 0.08 }))
      // Text: only the lines themselves (a heading's box is full width, its text often isn't)
      const range = document.createRange()
      const texts = Array.from(host.querySelectorAll(TEXT)).filter(visible).flatMap((el) => {
        const p = place(el), r = el.getBoundingClientRect()
        const dx = r.left - hostBox.left - (p.l + 24), dy = r.top - hostBox.top - (p.t + 24) // undo slide-in offsets
        const lines = []
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        while (walk.nextNode()) {
          if (!walk.currentNode.textContent.trim()) continue
          range.selectNodeContents(walk.currentNode)
          lines.push(...range.getClientRects())
        }
        return lines.map((q) => ({
          l: q.left - hostBox.left - dx - 16, r: q.right - hostBox.left - dx + 16,
          t: q.top - hostBox.top - dy - 16, b: q.bottom - hostBox.top - dy + 16, weight: 1,
        }))
      })
      const boxes = [...solids, ...texts]
      const hero = host.querySelector('.hero')
      const footer = host.querySelector('.footer')
      const start = hero ? hero.offsetTop + hero.offsetHeight : 0
      const end = footer ? footer.offsetTop : host.scrollHeight
      const overlap = (x, y, w, h) =>
        boxes.reduce((sum, b) => sum + b.weight * Math.max(0, Math.min(x + w, b.r) - Math.max(x, b.l)) * Math.max(0, Math.min(y + h, b.b) - Math.max(y, b.t)), 0)

      const list = []
      let want = start + 40
      for (let i = 0; want < end - 200 && i < 40; i++) {
        const motif = ORDER[i % ORDER.length]
        const w = motif === 'truss'
          ? (phone ? vw * 1.5 : Math.min(1300, Math.max(560, vw * 0.78)))
          : (phone ? Math.min(vw * 0.78, 420) : Math.min(700, Math.max(300, vw * 0.4)))
        const h = w * RATIO[motif]
        const out = phone ? vw * 0.22 : (motif === 'truss' ? vw * 0.14 : Math.max(16, vw * 0.04) * 1.2)
        const sides = { left: -out, right: vw - w + out }
        let best = null
        for (let dy = -360; dy <= 360; dy += 40) {
          const y = want + dy
          if (y < start - h * 0.3 || y + h * 0.55 > end) continue
          for (const side of i % 2 ? ['left', 'right'] : ['right', 'left']) {
            const x = sides[side]
            const score = overlap(x, y, w, h) / (w * h) + Math.abs(dy) / 4000 + (side === (i % 2 ? 'left' : 'right') ? 0 : 0.02)
            if (!best || score < best.score) best = { score, x, y, side }
          }
        }
        if (best && best.score < (phone ? 0.3 : 0.2)) {
          list.push({ motif, side: best.side, top: Math.round(best.y), left: Math.round(best.x), width: Math.round(w), speed: 0.04 + (i % 3) * 0.025 })
          want = best.y + STEP
        } else {
          want += STEP / 2
        }
      }
      const key = JSON.stringify(list)
      if (key !== last) { last = key; setSlots(list) }
    }
    measure()
    const ro = new ResizeObserver(() => requestAnimationFrame(measure))
    ro.observe(host)
    return () => ro.disconnect()
  }, [pathname])

  // Parallax: each drawing lags behind the scroll a little (skipped when the visitor prefers less motion)
  useEffect(() => {
    const box = ref.current
    if (!box || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(box.querySelectorAll('.bd-item'))
    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.scrollY + window.innerHeight / 2
      for (const el of items) {
        const shift = (mid - Number(el.dataset.top)) * Number(el.dataset.speed)
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [slots])

  return (
    <div className="backdrop" ref={ref} aria-hidden="true">
      {slots.map((s, i) => (
        <div
          key={`${s.top}-${i}`}
          className={`bd-item bd-item--${s.side} bd-${s.motif}`}
          style={{ top: s.top, left: s.left, width: s.width }}
          data-top={s.top}
          data-speed={s.speed}
        >
          <span className="bd-glow" />
          <Motif name={s.motif} />
        </div>
      ))}
    </div>
  )
}

function Motif({ name }) {
  if (name === 'hall') return <Hall />
  if (name === 'crane') return <Crane />
  if (name === 'truss') return <Truss />
  return <Axes />
}

const pts = (list) => list.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')

/** A steel hall in perspective, being assembled: finished frames, the frame going up (copper), the next one dashed. */
function Hall() {
  const N = 6, dx = 64, dy = -26
  const shape = [[0, 300], [0, 170], [130, 110], [260, 170], [260, 300]] // base, eave, ridge, eave, base
  const at = (i, k) => [shape[k][0] + i * dx, shape[k][1] + i * dy]
  const frame = (i) => pts(shape.map((_, k) => at(i, k)))
  const longs = [0, 1, 2, 3, 4].map((k) => pts([at(0, k), at(N - 2, k)])).join('')
  const brace = pts([at(1, 0), at(2, 1)]) + pts([at(1, 1), at(2, 0)]) + pts([at(1, 1), at(2, 2)]) + pts([at(1, 2), at(2, 1)])
  return (
    <svg viewBox="-30 -40 660 420" className="bd-svg">
      <path className="bd-l" d={Array.from({ length: N - 2 }, (_, i) => frame(i)).join('') + longs} />
      <path className="bd-l bd-l--soft" d={brace} />
      <path className="bd-a" d={frame(N - 2)} />
      <path className="bd-l bd-l--dash" d={frame(N - 1)} />
      <Dim x1={0} x2={260} y={336} label="24.000" />
      <path className="bd-l bd-l--soft" d={`M${at(0, 4)[0] + 20} ${at(0, 4)[1] + 18}L${at(N - 1, 4)[0] + 20} ${at(N - 1, 4)[1] + 18}`} />
      <text className="bd-t" x={at(2, 4)[0] + 44} y={at(2, 4)[1] + 30}>36.000</text>
    </svg>
  )
}

/** A mobile crane lifting a steel beam (the beam in copper). */
function Crane() {
  const base = [96, 420], tip = [372, 48], w = 14, n = 16
  const len = Math.hypot(tip[0] - base[0], tip[1] - base[1])
  const ux = (tip[0] - base[0]) / len, uy = (tip[1] - base[1]) / len
  const nx = -uy * w, ny = ux * w
  const A = (t) => [base[0] + (tip[0] - base[0]) * t, base[1] + (tip[1] - base[1]) * t]
  const lattice = Array.from({ length: n }, (_, i) => {
    const p = A(i / n), q = A((i + 1) / n)
    return i % 2 ? pts([[p[0] + nx, p[1] + ny], q]) : pts([p, [q[0] + nx, q[1] + ny]])
  }).join('')
  const chords = pts([base, tip]) + pts([[base[0] + nx, base[1] + ny], [tip[0] + nx, tip[1] + ny]])
  return (
    <svg viewBox="0 0 440 540" className="bd-svg">
      <path className="bd-l" d={chords + lattice} />
      <path className="bd-l" d="M40 470h190v26H40zM60 496a14 14 0 1 0 .1 0M210 496a14 14 0 1 0 .1 0M70 420h100v50H70zM110 420l-30-120 292-252" />
      <path className="bd-l bd-l--soft" d="M20 522h400" />
      <path className="bd-l" d={`M${tip[0] + 7} ${tip[1]}V300`} />
      <path className="bd-a" d={`M${tip[0] + 7} 300l-26 22M${tip[0] + 7} 300l26 22M318 322h122M318 334h122M318 322v12M440 322v12`} />
      <text className="bd-t" x="250" y="210">Ø 42.5 m</text>
    </svg>
  )
}

/** A lattice truss (roof beam) with its span dimension. */
function Truss() {
  const W = 1000, top = 22, bot = 102, p = 50
  const diag = Array.from({ length: W / p }, (_, i) => pts(i % 2 ? [[i * p, bot], [(i + 1) * p, top]] : [[i * p, top], [(i + 1) * p, bot]])).join('')
  const verts = Array.from({ length: W / p / 2 + 1 }, (_, i) => pts([[i * 2 * p, top], [i * 2 * p, bot]])).join('')
  return (
    <svg viewBox="-10 0 1020 170" className="bd-svg">
      <path className="bd-l" d={`M0 ${top}H${W}M0 ${bot}H${W}` + diag} />
      <path className="bd-l bd-l--soft" d={verts} />
      <path className="bd-a" d={`M0 ${top}H${W}`} />
      <Dim x1={0} x2={W} y={140} label="L = 30.000" ticks={4} />
    </svg>
  )
}

/** Structural grid lines with their bubbles (A, B, C / 1, 2) and column footings in copper. */
function Axes() {
  const cols = [[110, 'A'], [270, 'B'], [430, 'C']]
  const rows = [[130, '1'], [290, '2']]
  return (
    <svg viewBox="0 0 520 420" className="bd-svg">
      {cols.map(([x, l]) => (
        <g key={l}>
          <path className="bd-l bd-l--dash" d={`M${x} 42V410`} />
          <circle className="bd-l" cx={x} cy="24" r="17" />
          <text className="bd-t bd-t--c" x={x} y="29">{l}</text>
        </g>
      ))}
      {rows.map(([y, l]) => (
        <g key={l}>
          <path className="bd-l bd-l--dash" d={`M42 ${y}H510`} />
          <circle className="bd-l" cx="24" cy={y} r="17" />
          <text className="bd-t bd-t--c" x="24" y={y + 5}>{l}</text>
        </g>
      ))}
      <path className="bd-a" d={cols.flatMap(([x]) => rows.map(([y]) => `M${x - 7} ${y - 7}h14v14h-14z`)).join('')} />
      <Dim x1={110} x2={270} y={372} label="8.000" />
      <Dim x1={270} x2={430} y={372} label="8.000" />
    </svg>
  )
}

/** A dimension line with end ticks and a label, like on a building plan. */
function Dim({ x1, x2, y, label, ticks = 0 }) {
  const inner = Array.from({ length: ticks }, (_, i) => x1 + ((x2 - x1) * (i + 1)) / (ticks + 1))
  const tick = (x) => `M${x - 5} ${y + 5}L${x + 5} ${y - 5}M${x} ${y - 9}V${y + 9}`
  return (
    <g>
      <path className="bd-l bd-l--soft" d={`M${x1} ${y}H${x2}` + [x1, x2, ...inner].map(tick).join('')} />
      <text className="bd-t bd-t--c" x={(x1 + x2) / 2} y={y - 10}>{label}</text>
    </g>
  )
}
