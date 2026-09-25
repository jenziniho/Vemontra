import { defineArrayMember, defineField, defineType } from 'sanity'
import { BUILDING_TYPES } from '../../lib/buildingTypes'

// One "Project" = one building Vemontra worked on. Labels are in Dutch because that's what the editor sees.
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naam van het project',
      description: 'Bijvoorbeeld: "Logistieke hal Genk"',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Webadres',
      description: 'Klik op "Generate" — dit wordt het adres van de projectpagina.',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Hoofdfoto',
      description: 'De foto die op de projectenpagina getoond wordt.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Korte beschrijving van de foto',
          description: 'Wat is er te zien? Belangrijk voor Google en voor blinde bezoekers.',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: "Foto's",
      description: "Sleep hier meerdere foto's tegelijk in. De volgorde kan je verslepen.",
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Korte beschrijving', type: 'string' }),
            defineField({ name: 'caption', title: 'Bijschrift (optioneel)', type: 'string' }),
          ],
        }),
      ],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'buildingType',
      title: 'Type gebouw',
      type: 'string',
      description: 'Bepaalt onder welk icoon het project op de projectenpagina staat.',
      options: {
        list: BUILDING_TYPES.map((t) => ({ title: t.label, value: t.value })),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'location', title: 'Locatie', description: 'Gemeente, of gemeente + land', type: 'string' }),
    defineField({
      name: 'year',
      title: 'Jaar van oplevering',
      type: 'number',
      validation: (rule) => rule.integer().min(2006).max(2100),
    }),
    defineField({
      name: 'area',
      title: 'Oppervlakte (m²)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'services',
      title: 'Wat deed Vemontra?',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: ['Montage', 'Transport', 'Kraanverhuur'],
        layout: 'grid',
      },
    }),
    defineField({ name: 'client', title: 'Opdrachtgever (optioneel)', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      description: 'Een paar zinnen over het project. Een lege regel begint een nieuwe alinea.',
      type: 'text',
      rows: 6,
    }),
  ],
  orderings: [
    { title: 'Nieuwste eerst', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', location: 'location', year: 'year', media: 'coverImage' },
    prepare({ title, location, year, media }) {
      return { title, subtitle: [location, year].filter(Boolean).join(' · '), media }
    },
  },
})
