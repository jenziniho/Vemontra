import Link from 'next/link'
import { FLEET, specList } from '@/lib/fleet'
import SanityImage from './SanityImage'

/** Overview card for a crane or trailer. `kind` is 'crane' or 'trailer'. */
export default function FleetCard({ item, kind, priority = false }) {
  const cfg = FLEET[kind]
  const specs = specList(item, kind).slice(0, 3)
  return (
    <Link className="fcard" href={`${cfg.base}/${item.slug}`}>
      <div className="fcard__img">
        <SanityImage
          image={item.photo}
          alt={item.photo?.alt || item.name}
          aspect={16 / 10}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={priority}
        />
        {item.kind && <span className="fcard__kind">{item.kind}</span>}
      </div>
      <div className="fcard__body">
        <h3>{item.name}</h3>
        {specs.length > 0 && (
          <dl className="specs">
            {specs.map(([label, value, unit]) => (
              <div key={label}><dt>{label}</dt><dd>{value}{unit && <small> {unit}</small>}</dd></div>
            ))}
          </dl>
        )}
        {kind === 'crane' && item.withOperator && <p className="fcard__note">{item.withOperator}</p>}
        {kind === 'trailer' && item.suitableFor?.length > 0 && (
          <p className="fcard__note">Geschikt voor: {item.suitableFor.slice(0, 3).join(', ')}</p>
        )}
        <span className="fcard__more">Details en foto's <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  )
}
