import { defineArrayMember, defineField } from 'sanity'

// Fields shared by cranes (Kraanverhuur) and trailers/trucks (Transport)

export const nameField = defineField({
  name: 'name',
  title: 'Naam / model',
  type: 'string',
  validation: (rule) => rule.required().max(70),
})

export const slugField = defineField({
  name: 'slug',
  title: 'Webadres',
  description: 'Klik op "Generate".',
  type: 'slug',
  options: { source: 'name', maxLength: 80 },
  validation: (rule) => rule.required(),
})

export const photoField = defineField({
  name: 'photo',
  title: 'Hoofdfoto',
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Korte beschrijving', type: 'string' })],
  validation: (rule) => rule.required(),
})

export const galleryField = defineField({
  name: 'gallery',
  title: "Meer foto's",
  description: "Sleep hier meerdere foto's tegelijk in.",
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
})

export const extraSpecsField = defineField({
  name: 'extraSpecs',
  title: 'Extra specificaties',
  description: 'Alles wat hierboven niet staat, bv. "Aantal assen" → "4", of "Contragewicht" → "12 t".',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'spec',
      fields: [
        defineField({ name: 'label', title: 'Wat', type: 'string', validation: (rule) => rule.required() }),
        defineField({ name: 'value', title: 'Waarde', type: 'string', validation: (rule) => rule.required() }),
      ],
      preview: { select: { title: 'label', subtitle: 'value' } },
    }),
  ],
})

export const descriptionField = defineField({
  name: 'description',
  title: 'Beschrijving',
  description: 'Een paar zinnen. Een lege regel begint een nieuwe alinea.',
  type: 'text',
  rows: 5,
})

export const orderField = defineField({
  name: 'order',
  title: 'Volgorde',
  description: 'Lager getal = hoger in de lijst. Leeg laten mag.',
  type: 'number',
})

export const num = (name, title, description) =>
  defineField({ name, title, description, type: 'number', validation: (rule) => rule.min(0) })
