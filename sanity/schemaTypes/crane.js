import { defineField, defineType } from 'sanity'
import { CRANE_KINDS } from '../../lib/fleet'
import {
  descriptionField, extraSpecsField, galleryField, nameField, num, orderField, photoField, slugField,
} from './fleetFields'

// A crane for rent, shown on /kraanverhuur
export const crane = defineType({
  name: 'crane',
  title: 'Kraan',
  type: 'document',
  fields: [
    { ...nameField, description: 'Bijvoorbeeld: "Liebherr LTM 1060-3.1"' },
    slugField,
    defineField({
      name: 'kind',
      title: 'Soort kraan',
      type: 'string',
      options: { list: CRANE_KINDS, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    photoField,
    num('capacity', 'Hefvermogen (ton)', 'Maximale last.'),
    num('reach', 'Reikwijdte (m)', 'Maximale vlucht / gieklengte.'),
    num('height', 'Hijshoogte (m)'),
    defineField({
      name: 'withOperator',
      title: 'Verhuur',
      type: 'string',
      options: { list: ['Met machinist', 'Met of zonder machinist'], layout: 'radio' },
      initialValue: 'Met machinist',
    }),
    extraSpecsField,
    descriptionField,
    galleryField,
    orderField,
  ],
  orderings: [{ title: 'Volgorde', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', kind: 'kind', capacity: 'capacity', media: 'photo' },
    prepare: ({ title, kind, capacity, media }) => ({
      title, media, subtitle: [kind, capacity ? `${capacity} t` : null].filter(Boolean).join(' · '),
    }),
  },
})
