// The hero background photo. Lists every size that exists, so each screen downloads the smallest sharp version:
// a phone gets 1280px, a laptop 1920/2560px, a 4K screen the full 3840px image.
// To replace the photo: put new files in public/assets/ and update this list (widest last).
const SOURCES = [
  { src: '/assets/hero-1280.webp', w: 1280 },
  { src: '/assets/hero-1920.webp', w: 1920 },
  { src: '/assets/hero-2560.webp', w: 2560 },
  { src: '/assets/hero-3840.webp', w: 3840 },
]
const RATIO = 3072 / 5504 // height / width of the original photo

export default function HeroImage() {
  const fallback = SOURCES[1]
  const largest = SOURCES[SOURCES.length - 1]
  return (
    <img
      src={fallback.src}
      srcSet={SOURCES.map((s) => `${s.src} ${s.w}w`).join(', ')}
      sizes="100vw"
      alt=""
      width={largest.w}
      height={Math.round(largest.w * RATIO)}
      fetchPriority="high"
      decoding="async"
    />
  )
}
