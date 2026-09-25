// The building types a project can have. Used by Sanity (the dropdown), the Projects filter and the icons.
// `value` is what's stored in Sanity — don't change it once projects use it. `slug` is used in web addresses.
export const BUILDING_TYPES = [
  { value: 'Magazijn', slug: 'magazijn', label: 'Magazijn', plural: 'Magazijnen' },
  { value: 'Logistieke hal', slug: 'logistieke-hal', label: 'Logistieke hal', plural: 'Logistieke hallen' },
  { value: 'Productiehal', slug: 'productiehal', label: 'Productiehal', plural: 'Productiehallen' },
  { value: 'Kantoren en werkplaats', slug: 'kantoren-werkplaats', label: 'Kantoren en werkplaats', plural: 'Kantoren en werkplaatsen' },
  { value: 'Loods', slug: 'loods', label: 'Loods', plural: 'Loodsen' },
  { value: 'Andere', slug: 'andere', label: 'Andere', plural: 'Andere projecten' },
]

export function typeByValue(value) {
  return BUILDING_TYPES.find((t) => t.value === value) || null
}

export function typeBySlug(slug) {
  return BUILDING_TYPES.find((t) => t.slug === slug) || null
}
