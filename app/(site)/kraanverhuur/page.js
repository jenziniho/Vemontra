import Link from 'next/link'
import FleetGrid from '@/components/FleetGrid'
import { ArrowIcon, Slashes } from '@/components/Icons'
import { site } from '@/lib/site'
import { sanityFetch } from '@/sanity/client'
import { FLEET_QUERY } from '@/sanity/queries'

export const revalidate = 60

export const metadata = {
  title: 'Kraanverhuur',
  description: 'Mobiele kranen en torenkranen met ervaren machinist te huur. Hefvermogen, reikwijdte en hijshoogte per kraan.',
}

const POINTS = [
  ['Met ervaren machinist', 'Onze machinisten kennen hun kraan en werken dagelijks op industriële werven.'],
  ['Voor elke hijsklus', 'Van prefab wanden en stalen spanten tot machines en dakelementen.'],
  ['Snel ingepland', 'Eén telefoontje en we bekijken samen welke kraan past bij uw last en werf.'],
]

export default async function KraanverhuurPage() {
  const cranes = await sanityFetch(FLEET_QUERY, { type: 'crane' }, [])
  return (
    <section className="page">
      <div className="wrap">
        <p className="eyebrow"><Slashes size={20} /> Kraanverhuur</p>
        <h1>Kranen met machinist, voor elke hijsklus.</h1>
        <p className="lede">
          Huur een kraan uit ons eigen kranenpark, met machinist. Bekijk hieronder per kraan het hefvermogen,
          de reikwijdte en de hijshoogte.
        </p>
        <div className="cta-row" style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <Link className="btn btn--sm" href="/contact?dienst=Kraanverhuur">Kraan aanvragen <ArrowIcon /></Link>
          <span className="cta-row__phone">of bel <strong>{site.phone}</strong></span>
        </div>

        <h2 className="section-title">Ons kranenpark</h2>
        <FleetGrid items={cranes} kind="crane" emptyText="Ons kranenpark wordt binnenkort op de website gezet." />

        <h2>Waarom kraanverhuur bij Vemontra</h2>
        <div className="cols">
          {POINTS.map(([t, d]) => <div className="tile" key={t}><h3>{t}</h3><p>{d}</p></div>)}
        </div>
        <p className="note">Voorbeeldtekst — pas aan waar nodig.</p>
      </div>
    </section>
  )
}
