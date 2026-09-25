// Cranes (Kraanverhuur) and trailers/trucks (Transport): kinds and which specs to show.
// Each spec: [field in Sanity, label on the website, unit]. The first three are shown on the overview cards.

export const CRANE_KINDS = ['Mobiele kraan', 'Torenkraan', 'Rupskraan', 'Kraanwagen / laadkraan', 'Minikraan', 'Andere']
export const TRAILER_KINDS = [
  'Trekker (vrachtwagen)',
  'Vlakke oplegger',
  'Uitschuifbare oplegger',
  'Semi-dieplader',
  'Dieplader',
  'Andere',
]

export const FLEET = {
  crane: {
    type: 'crane',
    base: '/kraanverhuur',
    service: 'Kraanverhuur',
    cta: 'Deze kraan huren',
    specs: [
      ['capacity', 'Hefvermogen', 't'],
      ['reach', 'Reikwijdte', 'm'],
      ['height', 'Hijshoogte', 'm'],
    ],
  },
  trailer: {
    type: 'trailer',
    base: '/transport',
    service: 'Transport',
    cta: 'Transport aanvragen',
    specs: [
      ['payload', 'Laadvermogen', 't'],
      ['deckLength', 'Laadvloer', 'm'],
      ['extendedLength', 'Uitschuifbaar tot', 'm'],
      ['deckWidth', 'Breedte', 'm'],
      ['deckHeight', 'Vloerhoogte', 'm'],
    ],
  },
}

const nf = new Intl.NumberFormat('nl-BE', { maximumFractionDigits: 2 })
export const fmt = (v) => nf.format(v)

/** The specs of one item that are filled in, as [label, "12,5 m"] pairs (plus the free "extra specs"). */
export function specList(item, kind, { withExtra = false } = {}) {
  const list = FLEET[kind].specs
    .filter(([key]) => typeof item[key] === 'number')
    .map(([key, label, unit]) => [label, fmt(item[key]), unit])
  if (withExtra) for (const s of item.extraSpecs || []) if (s?.label && s?.value) list.push([s.label, s.value, ''])
  return list
}
