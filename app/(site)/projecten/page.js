import { Slashes } from '@/components/Icons'
import ProjectsBrowser from '@/components/ProjectsBrowser'
import { sanityFetch } from '@/sanity/client'
import { isSanityConfigured } from '@/sanity/env'
import { PROJECTS_QUERY } from '@/sanity/queries'

export const revalidate = 60

export const metadata = {
  title: 'Projecten',
  description: 'Een selectie van de industriële gebouwen die Vemontra monteerde: magazijnen, productiehallen, kantoren en werkplaatsen.',
}

export default async function ProjectenPage() {
  const projects = await sanityFetch(PROJECTS_QUERY, {}, [])

  return (
    <section className="page">
      <div className="wrap">
        <p className="eyebrow"><Slashes size={20} /> Projecten</p>
        <h1>Gebouwen die we recht zetten.</h1>
        <p className="lede">
          Van magazijn tot productiehal: een selectie van de werven waar Vemontra de montage, het transport of het kraanwerk verzorgde.
        </p>

        <ProjectsBrowser projects={projects} />
        {/* Setup hints are only visible while developing, never to visitors */}
        {projects.length === 0 && process.env.NODE_ENV === 'development' && (
          <p className="note">
            {isSanityConfigured
              ? <>Nog geen projecten. Voeg er een toe in de Studio op <code>/studio</code>.</>
              : <>Sanity is nog niet gekoppeld. Vul <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env.local</code> in (zie README).</>}
          </p>
        )}
      </div>
    </section>
  )
}
