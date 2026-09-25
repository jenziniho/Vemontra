'use client'

/**
 * Configuration of the Sanity editor ("Studio"), which runs inside this website at /studio.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'vemontra',
  title: 'Vemontra',
  basePath: '/studio',
  projectId: projectId || 'placeholder',
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      title: 'Inhoud',
      structure: (S) =>
        S.list()
          .title('Inhoud')
          .items([
            S.documentTypeListItem('project').title('Projecten'),
            S.divider(),
            S.documentTypeListItem('crane').title('Kranen (Kraanverhuur)'),
            S.documentTypeListItem('trailer').title('Opleggers en vrachtwagens (Transport)'),
          ]),
    }),
    // Query playground for developers; only shown in development
    ...(process.env.NODE_ENV === 'development' ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
})
