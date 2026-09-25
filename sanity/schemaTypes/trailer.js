import { defineField, defineType } from 'sanity'
import { TRAILER_KINDS } from '../../lib/fleet'
import {
  descriptionField, extraSpecsField, galleryField, nameField, num, orderField, photoField, slugField,
} from './fleetFields'

// A trailer (or the truck itself), shown on /transport
export const trailer = defineType({
  name: 'trailer',
  title: 'Oplegger / vrachtwagen',
  type: 'document',
  fields: [
    { ...nameField, description: 'Bijvoorbeeld: "Nooteboom semi-dieplader, 3 assen"' },
    slugField,
    defineField({
      name: 'kind',
      title: 'Soort',
      type: 'string',
      options: { list: TRAILER_KINDS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    photoField,
    num('payload', 'Laadvermogen (ton)'),
    num('deckLength', 'Lengte laadvloer (m)'),
    num('extendedLength', 'Uitschuifbaar tot (m)', 'Alleen invullen als de oplegger kan uitschuiven.'),
    num('deckWidth', 'Breedte laadvloer (m)'),
    num('deckHeight', 'Hoogte laadvloer (m)', 'Belangrijk bij hoge ladingen (diepladers).'),
    defineField({
      name: 'suitableFor',
      title: 'Geschikt voor',
      description: 'Bijvoorbeeld: "prefab betonwanden", "stalen spanten", "machines". Druk op Enter na elk item.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    extraSpecsField,
    descriptionField,
    galleryField,
    orderField,
  ],
  orderings: [{ title: 'Volgorde', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', kind: 'kind', payload: 'payload', media: 'photo' },
    prepare: ({ title, kind, payload, media }) => ({
      title, media, subtitle: [kind, payload ? `${payload} t` : null].filter(Boolean).join(' · '),
    }),
  },
})
