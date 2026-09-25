import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from './env'

const builder = createImageUrlBuilder({ projectId: projectId || 'placeholder', dataset })

// Build a CDN URL for an image uploaded in Sanity, e.g. urlFor(project.coverImage).width(1200).url()
export function urlFor(source) {
  return builder.image(source).auto('format').fit('max')
}
