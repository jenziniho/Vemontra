// Generates /sitemap.xml for Google, including every project page
import { site } from '@/lib/site'
import { sanityFetch } from '@/sanity/client'
import { FLEET_SLUGS_QUERY, PROJECT_SLUGS_QUERY } from '@/sanity/queries'

export const revalidate = 3600

export default async function sitemap() {
  const slugs = await sanityFetch(PROJECT_SLUGS_QUERY, {}, [])
  const cranes = await sanityFetch(FLEET_SLUGS_QUERY, { type: 'crane' }, [])
  const trailers = await sanityFetch(FLEET_SLUGS_QUERY, { type: 'trailer' }, [])
  const pages = ['', '/over-vemontra', '/wat-doet-vemontra', '/kraanverhuur', '/transport', '/projecten', '/contact']
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 })),
    ...slugs.map((s) => ({ url: `${site.url}/projecten/${s}`, changeFrequency: 'yearly', priority: 0.6 })),
    ...cranes.map((s) => ({ url: `${site.url}/kraanverhuur/${s}`, changeFrequency: 'yearly', priority: 0.6 })),
    ...trailers.map((s) => ({ url: `${site.url}/transport/${s}`, changeFrequency: 'yearly', priority: 0.6 })),
  ]
}
