import { notFound } from 'next/navigation'
import FleetDetail from '@/components/FleetDetail'
import { sanityFetch, slugParams } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { FLEET_ITEM_QUERY, FLEET_SLUGS_QUERY } from '@/sanity/queries'

export const revalidate = 60
const TYPE = 'trailer'

export async function generateStaticParams() {
  const slugs = await sanityFetch(FLEET_SLUGS_QUERY, { type: TYPE }, [])
  return slugParams(slugs)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await sanityFetch(FLEET_ITEM_QUERY, { type: TYPE, slug })
  if (!item) return {}
  return {
    title: item.name,
    description: [item.kind, item.description?.split('\n')[0]].filter(Boolean).join(' — ').slice(0, 160),
    openGraph: item.photo?.asset
      ? { images: [{ url: urlFor(item.photo).width(1200).height(630).fit('crop').url(), width: 1200, height: 630 }] }
      : undefined,
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const item = await sanityFetch(FLEET_ITEM_QUERY, { type: TYPE, slug })
  if (!item) notFound()
  return <FleetDetail item={item} kind={TYPE} />
}
