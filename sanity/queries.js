import { groq } from 'next-sanity'

const projectCard = groq`
  _id,
  title,
  "slug": slug.current,
  buildingType,
  location,
  year,
  area,
  coverImage
`

// Newest projects first (by year, then by when they were added)
export const PROJECTS_QUERY = groq`
  *[_type == "project" && defined(slug.current)] | order(year desc, _createdAt desc) { ${projectCard} }
`

export const RECENT_PROJECTS_QUERY = groq`
  *[_type == "project" && defined(slug.current)] | order(year desc, _createdAt desc) [0...3] { ${projectCard} }
`

export const PROJECT_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectCard},
    client,
    services,
    description,
    gallery[]{ ..., "dimensions": asset->metadata.dimensions }
  }
`

export const PROJECT_SLUGS_QUERY = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`

// Homepage showcase: the newest projects for the photo panels, plus the total count
export const SHOWCASE_QUERY = groq`{
  "projects": *[_type == "project" && defined(slug.current) && defined(coverImage.asset)] | order(year desc, _createdAt desc) [0...5] {
    title,
    "slug": slug.current,
    coverImage,
    buildingType,
    location
  },
  "total": count(*[_type == "project" && defined(slug.current)])
}`

// Cranes (Kraanverhuur) and trailers/trucks (Transport), in the order set in the Studio
const fleetCard = groq`_id, name, "slug": slug.current, kind, photo, capacity, reach, height, withOperator,
  payload, deckLength, extendedLength, deckWidth, deckHeight, suitableFor`

export const FLEET_QUERY = groq`
  *[_type == $type && defined(slug.current)] | order(coalesce(order, 999) asc, _createdAt asc) { ${fleetCard} }
`
export const FLEET_ITEM_QUERY = groq`
  *[_type == $type && slug.current == $slug][0] { ${fleetCard}, extraSpecs, description, gallery[defined(asset)] }
`
export const FLEET_SLUGS_QUERY = groq`
  *[_type == $type && defined(slug.current)].slug.current
`
