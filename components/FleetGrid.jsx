import Link from 'next/link'
import FleetCard from './FleetCard'

/** Grid of cranes or trailers, with a friendly message while the list is still empty. */
export default function FleetGrid({ items, kind, emptyText }) {
  if (!items?.length) {
    return (
      <div className="empty">
        <p>{emptyText}</p>
        <p><Link href="/contact">Neem contact op</Link> voor beschikbaarheid en prijzen.</p>
      </div>
    )
  }
  return (
    <div className="fgrid">
      {items.map((it, i) => <FleetCard key={it._id} item={it} kind={kind} priority={i < 3} />)}
    </div>
  )
}
