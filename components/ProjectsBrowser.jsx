'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BUILDING_TYPES, typeBySlug } from '@/lib/buildingTypes'
import BuildingTypeIcon from './BuildingTypeIcon'
import ProjectCard from './ProjectCard'

/**
 * Projects grid with a row of building-type icons on top. Clicking an icon shows only that type.
 * The choice is kept in the web address (?type=loods), so a filtered view can be shared or linked to.
 */
export default function ProjectsBrowser({ projects }) {
  const [active, setActive] = useState(null)
  // Read ?type=… in the browser, so the page itself can stay fully static
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type')
    if (typeBySlug(t)) setActive(typeBySlug(t).slug)
  }, [])
  const activeType = typeBySlug(active)

  const choose = (slug) => {
    setActive(slug)
    const url = slug ? `/projecten?type=${slug}` : '/projecten'
    window.history.replaceState(window.history.state, '', url)
  }

  const count = (value) => projects.filter((p) => p.buildingType === value).length
  const list = activeType ? projects.filter((p) => p.buildingType === activeType.value) : projects

  const Filter = ({ slug, label, n }) => (
    <button
      type="button"
      className="tfilter"
      aria-pressed={active === slug}
      onClick={() => choose(slug)}
    >
      <BuildingTypeIcon slug={slug || 'alle'} size={46} />
      <span className="tfilter__label">{label}</span>
      <span className="tfilter__count">{n}</span>
    </button>
  )

  return (
    <>
      <div className="tfilters" role="group" aria-label="Filter op type gebouw">
        <Filter slug={null} label="Alle projecten" n={projects.length} />
        {BUILDING_TYPES.map((t) => (
          <Filter key={t.slug} slug={t.slug} label={t.plural} n={count(t.value)} />
        ))}
      </div>

      <p className="tresult" aria-live="polite">
        {activeType
          ? `${list.length} ${list.length === 1 ? activeType.label.toLowerCase() : activeType.plural.toLowerCase()}`
          : `${list.length} ${list.length === 1 ? 'project' : 'projecten'}`}
      </p>

      {list.length > 0 ? (
        <div className="pgrid" key={active || 'alle'}>
          {list.map((p, i) => <ProjectCard key={p._id} project={p} priority={i < 3} />)}
        </div>
      ) : (
        <div className="empty">
          <p>
            {activeType
              ? `Nog geen ${activeType.plural.toLowerCase()} toegevoegd.`
              : 'Binnenkort vindt u hier onze realisaties.'}
          </p>
          {activeType && (
            <p>
              <button type="button" className="linkbtn" onClick={() => choose(null)}>Toon alle projecten</button>
              {' '}of <Link href="/contact">vraag uw project aan</Link>.
            </p>
          )}
        </div>
      )}
    </>
  )
}
