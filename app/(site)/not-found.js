import Link from 'next/link'
import { ArrowIcon } from '@/components/Icons'

export default function NotFound() {
  return (
    <section className="page">
      <div className="wrap">
        <h1>Deze pagina bestaat niet (meer).</h1>
        <p className="lede">Misschien is het project verplaatst of de link verkeerd overgenomen.</p>
        <Link className="btn btn--sm" href="/">Naar de homepage <ArrowIcon /></Link>
      </div>
    </section>
  )
}
