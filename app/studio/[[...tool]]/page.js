/**
 * The Sanity Studio, where projects are added and edited. Lives at /studio on the website.
 * Log in with the account that created the Sanity project (or one that was invited to it).
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'
import { isSanityConfigured } from '../../../sanity/env'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '15vh auto', padding: '0 20px', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24 }}>Sanity is nog niet gekoppeld</h1>
        <p>
          Vul <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in, in het bestand <code>.env.local</code> (lokaal) of in de
          instellingen van Vercel (online). De stappen staan in <code>README.md</code>.
        </p>
      </div>
    )
  }
  return <NextStudio config={config} />
}
