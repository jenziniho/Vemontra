import Link from 'next/link'
import { Slashes } from '@/components/Icons'

export const metadata = {
  title: 'Wat doet Vemontra',
  description: 'Montage, transport en kraanverhuur voor industriële gebouwen, uitgevoerd door één ploeg met eigen materieel.',
}

const SERVICES = [
  ['Montage', 'Opbouw van stalen en betonnen hoofdconstructies, gevelpanelen, dakplaten en afwerking. Van prefab wand tot laatste boutverbinding.', '/projecten', 'Bekijk onze projecten'],
  ['Transport', 'Transport van prefab elementen, spanten en machines, met eigen vrachtwagen en opleggers.', '/transport', 'Bekijk onze opleggers'],
  ['Kraanverhuur', 'Mobiele kranen en torenkranen met machinist, voor onze eigen werven of als losse verhuur op uw project.', '/kraanverhuur', 'Bekijk ons kranenpark'],
]

export default function WatDoetPage() {
  return (
    <section className="page">
      <div className="wrap">
        <p className="eyebrow"><Slashes size={20} /> Wat doet Vemontra</p>
        <h1>Montage. Transport. Kraanverhuur.</h1>
        <p className="lede">Drie diensten die naadloos in elkaar overgaan, uitgevoerd door één ploeg met eigen materieel.</p>
        <div className="cols">
          {SERVICES.map(([title, text, href, more]) => (
            <Link className="tile" href={href} key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="tile__more">{more} →</span>
            </Link>
          ))}
        </div>
        <p className="note">Voorbeeldtekst — vervang door de echte dienstbeschrijvingen.</p>
      </div>
    </section>
  )
}
