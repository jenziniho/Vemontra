import { createClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null

/**
 * Fetch content from Sanity. Returns `fallback` when Sanity isn't set up yet or can't be reached,
 * so the rest of the website always keeps working.
 */
export async function sanityFetch(query, params = {}, fallback = null) {
  if (!client) return fallback
  try {
    // Pages refresh their Sanity content at most every 60 seconds
    return await client.fetch(query, params, { next: { revalidate: 60 } })
  } catch (err) {
    console.error('[sanity] fetch failed:', err.message)
    return fallback
  }
}

/**
 * Turn a list of slugs into generateStaticParams() output. A static export (npm run build:static) refuses an
 * empty list, so while there's nothing in Sanity yet it gets one placeholder page (which shows "not found").
 */
export function slugParams(slugs) {
  const list = (slugs || []).map((slug) => ({ slug }))
  if (list.length === 0 && process.env.STATIC_EXPORT === '1') return [{ slug: 'leeg' }]
  return list
}
