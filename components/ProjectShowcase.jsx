import Link from 'next/link'
import { urlFor } from '@/sanity/image'
import { ArrowIcon, Slashes } from './Icons'
import ProjectPanels from './ProjectPanels'

// Until there are at least 3 projects with a photo in Sanity, the panels use the site's own photos,
// each cropped differently, and all lead to the Projects page.
const FALLBACK = [
  { src: '/assets/bld.webp', pos: '55% 60%', href: '/projecten' },
  { src: '/assets/hero.webp', pos: '30% 40%', href: '/projecten' },
  { src: '/assets/bld.webp', pos: '88% 45%', href: '/projecten' },
  { src: '/assets/hero.webp', pos: '72% 60%', href: '/projecten' },
  { src: '/assets/bld.webp', pos: '12% 55%', href: '/projecten' },
]

/** Big homepage section that leads to the projects: intro text + expanding photo panels. */
export default function ProjectShowcase({ data }) {
  const projects = (data?.projects || []).filter((p) => p.coverImage?.asset)
  const total = data?.total || 0
  const panels =
    projects.length >= 3
      ? projects.map((p) => ({
          src: urlFor(p.coverImage).width(1400).url(),
          alt: p.coverImage.alt || p.title,
          title: p.title,
          subtitle: [p.buildingType, p.location].filter(Boolean).join(' · '),
          href: `/projecten/${p.slug}`,
        }))
      : FALLBACK

  return (
    <section className="showcase" aria-labelledby="showcase-title">
      <div className="wrap showcase__grid" data-reveal="right">
        <div className="showcase__intro">
          <p className="eyebrow"><Slashes size={20} /> Projecten</p>
          <h2 id="showcase-title">Bekijk wat we al <em>recht zetten</em>.</h2>
          <p className="showcase__text">
            Magazijnen, productiehallen, kantoren en werkplaatsen: elk project met foto's, oppervlakte en wat Vemontra
            er deed.
          </p>
          {total > 0 && (
            <p className="showcase__stat"><strong>{total}</strong> {total === 1 ? 'project' : 'projecten'} online</p>
          )}
          <Link className="btn" href="/projecten">Alle projecten <ArrowIcon /></Link>
        </div>

        <ProjectPanels panels={panels} />
      </div>
    </section>
  )
}
