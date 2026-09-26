/**
 * Called by a Sanity webhook every time something is published, so the website shows the change right away
 * instead of waiting for the 60-second refresh. Needs one setting (in .env.local, and in Vercel when online):
 *   SANITY_REVALIDATE_SECRET  any long random string, the same one filled in as "Secret" on the webhook
 * See README, "Changes from the Studio show up immediately".
 */
import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { SANITY_TAG } from '@/sanity/client'

export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return Response.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 503 })

  try {
    // Checks the signature and waits until Sanity serves the new content before we clear the cache
    const { isValidSignature, body } = await parseBody(request, secret, true)
    if (!isValidSignature) return Response.json({ message: 'Invalid signature' }, { status: 401 })

    // All Sanity queries share one tag: any publish refreshes every page that shows Sanity content
    revalidateTag(SANITY_TAG, { expire: 0 })
    return Response.json({ revalidated: true, type: body?._type ?? null })
  } catch (err) {
    console.error('[sanity] revalidate failed:', err.message)
    return Response.json({ message: 'Could not revalidate' }, { status: 500 })
  }
}
