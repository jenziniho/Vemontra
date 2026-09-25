import Link from 'next/link'
import { notFound } from 'next/navigation'
import BuildingTypeIcon from '@/components/BuildingTypeIcon'
import { ArrowIcon } from '@/components/Icons'
import { typeByValue } from '@/lib/buildingTypes'
import { formatArea } from '@/components/ProjectCard'
import ProjectGallery from '@/components/ProjectGallery'
import SanityImage from '@/components/SanityImage'
import { sanityFetch, slugParams } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from '@/sanity/queries'

export const revalidate = 60

// Pre-build the pages of existing projects; new projects are built on first visit
export async function generateStaticParams() {
  const slugs = await sanityFetch(PROJECT_SLUGS_QUERY, {}, [])
  return slugParams(slugs)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const project = await sanityFetch(PROJECT_QUERY, { slug })
  if (!project) return {}
  const description = project.description?.split('\n')[0]?.slice(0, 160) ||
    [project.buildingType, project.location, project.year].filter(Boolean).join(' · ')
  return {
    title: project.title,
    description,
    openGraph: project.coverImage?.asset
      ? { images: [{ url: urlFor(project.coverImage).width(1200).height(630).fit('crop').url(), width: 1200, height: 630 }] }
      : undefined,
  }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const project = await sanityFetch(PROJECT_QUERY, { slug })
  if (!project) notFound()

  const facts = [
    ['Type', project.buildingType],
    ['Locatie', project.location],
    ['Jaar', project.year],
    ['Oppervlakte', formatArea(project.area)],
    ['Opdrachtgever', project.client],
    ['Diensten', project.services?.join(', ')],
  ].filter(([, v]) => v)

  const paragraphs = (project.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const gallery = project.gallery?.filter((img) => img?.asset) || []

  return (
    <article className="page">
      <div className="wrap">
        <Link className="back" href="/projecten">‹ Alle projecten</Link>
        <h1>{project.title}</h1>
        {(project.buildingType || project.location) && (
          <p className="lede ptype">
            {project.buildingType && <BuildingTypeIcon slug={typeByValue(project.buildingType)?.slug} size={34} />}
            {[project.buildingType, project.location].filter(Boolean).join(' in ')}
          </p>
        )}

        <div className="pdetail__hero">
          <SanityImage image={project.coverImage} alt={project.coverImage?.alt || project.title} sizes="100vw" priority />
        </div>

        <div className="pdetail__grid">
          <div className="prose">
            {paragraphs.length > 0
              ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
              : <p style={{ color: 'var(--muted)' }}>Meer informatie over dit project volgt binnenkort.</p>}
            <p style={{ marginTop: 28 }}>
              <Link className="btn btn--sm" href="/contact">Zo'n project plannen? <ArrowIcon /></Link>
            </p>
          </div>
          {facts.length > 0 && (
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}
        </div>

        {gallery.length > 0 && (
          <>
            <h2>Foto's</h2>
            <ProjectGallery images={gallery} title={project.title} />
          </>
        )}
      </div>
    </article>
  )
}
