import Link from 'next/link'
import SanityImage from './SanityImage'
import BuildingTypeIcon from './BuildingTypeIcon'
import { typeByValue } from '@/lib/buildingTypes'

export function formatArea(m2) {
  return m2 ? `${new Intl.NumberFormat('nl-BE').format(m2)} m²` : null
}

export default function ProjectCard({ project, priority = false }) {
  const meta = [project.location, project.year, formatArea(project.area)].filter(Boolean)
  return (
    <Link className="pcard" href={`/projecten/${project.slug}`}>
      <div className="pcard__img">
        <SanityImage
          image={project.coverImage}
          alt={project.coverImage?.alt || project.title}
          aspect={4 / 3}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={priority}
        />
        {project.buildingType && (
          <span className="pcard__type">
            <BuildingTypeIcon slug={typeByValue(project.buildingType)?.slug} size={18} />
            {project.buildingType}
          </span>
        )}
      </div>
      <h3>{project.title}</h3>
      {meta.length > 0 && (
        <div className="pmeta">
          {meta.map((m) => <span key={m}>{m}</span>)}
        </div>
      )}
    </Link>
  )
}
