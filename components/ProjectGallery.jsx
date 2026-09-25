'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { urlFor } from '@/sanity/image'
import SanityImage from './SanityImage'

/** Grid of project photos; clicking one opens it full-screen with previous/next buttons. */
export default function ProjectGallery({ images, title }) {
  const dialogRef = useRef(null)
  const [index, setIndex] = useState(null)
  const count = images.length

  const open = (i) => {
    setIndex(i)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()
  const step = useCallback((d) => setIndex((i) => (i === null ? i : (i + d + count) % count)), [count])

  useEffect(() => {
    const onKey = (e) => {
      if (!dialogRef.current?.open) return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const current = index !== null ? images[index] : null

  return (
    <>
      <div className="gallery">
        {images.map((img, i) => (
          <button key={img._key || i} type="button" onClick={() => open(i)} aria-label={`Foto ${i + 1} vergroten`}>
            <SanityImage
              image={img}
              alt={img.alt || `${title} — foto ${i + 1}`}
              aspect={4 / 3}
              sizes="(max-width: 700px) 100vw, 33vw"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setIndex(null)}
        onClick={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('lightbox__inner')) close() }}
        aria-label="Foto's"
      >
        {current && (
          <figure className="lightbox__inner" style={{ margin: 0 }}>
            <img
              src={urlFor(current).width(2200).url()}
              alt={current.alt || `${title} — foto ${index + 1}`}
            />
            <figcaption>
              {current.caption ? `${current.caption} · ` : ''}{index + 1} / {count}
            </figcaption>
            <button type="button" className="lightbox__btn lightbox__close" onClick={close} aria-label="Sluiten">×</button>
            {count > 1 && (
              <>
                <button type="button" className="lightbox__btn lightbox__prev" onClick={() => step(-1)} aria-label="Vorige foto">‹</button>
                <button type="button" className="lightbox__btn lightbox__next" onClick={() => step(1)} aria-label="Volgende foto">›</button>
              </>
            )}
          </figure>
        )}
      </dialog>
    </>
  )
}
