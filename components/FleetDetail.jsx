import Link from 'next/link'
import { FLEET, specList } from '@/lib/fleet'
import { site } from '@/lib/site'
import { ArrowIcon } from './Icons'
import ProjectGallery from './ProjectGallery'
import SanityImage from './SanityImage'

/** Detail page body for one crane or trailer. */
export default function FleetDetail({ item, kind }) {
  const cfg = FLEET[kind]
  const facts = [['Soort', item.kind, ''], ...specList(item, kind, { withExtra: true })].filter(([, v]) => v)
  if (kind === 'crane' && item.withOperator) facts.push(['Verhuur', item.withOperator, ''])
  const paragraphs = (item.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const gallery = item.gallery || []
  const contactHref = `/contact?dienst=${encodeURIComponent(cfg.service)}&item=${encodeURIComponent(item.name)}`

  return (
    <article className="page">
      <div className="wrap">
        <Link className="back" href={cfg.base}>‹ {kind === 'crane' ? 'Alle kranen' : 'Alle opleggers'}</Link>
        <h1>{item.name}</h1>
        {item.kind && <p className="lede">{item.kind}</p>}

        <div className="pdetail__hero">
          <SanityImage image={item.photo} alt={item.photo?.alt || item.name} sizes="100vw" priority />
        </div>

        <div className="pdetail__grid">
          <div className="prose">
            {item.suitableFor?.length > 0 && (
              <div className="suitable">
                <h3>Geschikt voor</h3>
                <ul>{item.suitableFor.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <div className="cta-row">
              <Link className="btn btn--sm" href={contactHref}>{cfg.cta} <ArrowIcon /></Link>
              <span className="cta-row__phone">of bel <strong>{site.phone}</strong></span>
            </div>
          </div>
          {facts.length > 0 && (
            <dl className="facts">
              {facts.map(([k, v, unit]) => (
                <div key={k}><dt>{k}</dt><dd>{v}{unit ? ` ${unit}` : ''}</dd></div>
              ))}
            </dl>
          )}
        </div>

        {gallery.length > 0 && (
          <>
            <h2>Foto's</h2>
            <ProjectGallery images={gallery} title={item.name} />
          </>
        )}
      </div>
    </article>
  )
}
