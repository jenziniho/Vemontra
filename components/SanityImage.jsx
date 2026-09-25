import { urlFor } from '@/sanity/image'

const WIDTHS = [480, 800, 1200, 1600, 2200]

/**
 * Shows an image uploaded in Sanity. Sanity's CDN resizes it, so each device downloads a fitting size.
 * `aspect` (e.g. 4/3) crops around the hotspot the editor set in the Studio.
 */
export default function SanityImage({ image, alt, sizes = '100vw', aspect, priority = false, className }) {
  if (!image?.asset) return null
  const src = (w) => {
    let b = urlFor(image).width(w)
    if (aspect) b = b.height(Math.round(w / aspect)).fit('crop')
    return b.url()
  }
  return (
    <img
      className={className}
      src={src(1200)}
      srcSet={WIDTHS.map((w) => `${src(w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt ?? image.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
