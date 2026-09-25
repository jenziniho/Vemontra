import Link from 'next/link'
import FleetGrid from '@/components/FleetGrid'
import { ArrowIcon, Slashes } from '@/components/Icons'
import { site } from '@/lib/site'
import { sanityFetch } from '@/sanity/client'
import { FLEET_QUERY } from '@/sanity/queries'

export const revalidate = 60

export const metadata = {
  title: 'Transport',
  description: 'Transport van prefab betonelementen, stalen spanten en machines met eigen vrachtwagen en opleggers.',
}

const SERVICES = [
  ['Prefab elementen', 'Betonwanden, kolommen en liggers, veilig gezekerd van fabriek tot werf.'],
  ['Staal en spanten', 'Lange en zware stukken op uitschuifbare en vlakke opleggers.'],
  ['Machines en materieel', 'Hoge of zware lasten op de (semi-)dieplader, met vergunning waar nodig.'],
]

export default async function TransportPage() {
  const trailers = await sanityFetch(FLEET_QUERY, { type: 'trailer' }, [])
  return (
    <section className="page">
      <div className="wrap">
        <p className="eyebrow"><Slashes size={20} /> Transport</p>
        <h1>Transport van prefab, staal en machines.</h1>
        <p className="lede">
          Met onze eigen vrachtwagen en opleggers brengen we uw bouwelementen en machines tot op de werf.
          Elke oplegger heeft zijn eigen toepassing: bekijk hieronder wat ze kunnen dragen.
        </p>
        <div className="cta-row" style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <Link className="btn btn--sm" href="/contact?dienst=Transport">Transport aanvragen <ArrowIcon /></Link>
          <span className="cta-row__phone">of bel <strong>{site.phone}</strong></span>
        </div>

        <h2 className="section-title">Onze vrachtwagen en opleggers</h2>
        <FleetGrid items={trailers} kind="trailer" emptyText="Onze opleggers worden binnenkort op de website gezet." />

        <h2>Wat we vervoeren</h2>
        <div className="cols">
          {SERVICES.map(([t, d]) => <div className="tile" key={t}><h3>{t}</h3><p>{d}</p></div>)}
        </div>
        <p className="note">Voorbeeldtekst — pas aan waar nodig.</p>
      </div>
    </section>
  )
}
