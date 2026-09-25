import { Slashes } from '@/components/Icons'

export const metadata = {
  title: 'Over Vemontra',
  description: 'Sinds 2006 bouwt Vemontra industriële gebouwen, van A tot Z: montage, transport en kraanverhuur in eigen beheer.',
}

export default function OverPage() {
  return (
    <section className="page">
      <div className="wrap">
        <p className="eyebrow"><Slashes size={20} /> Over Vemontra</p>
        <h1>Sinds 2006 bouwen we industriële gebouwen, van A tot Z.</h1>
        <p className="lede">
          Vemontra bv is een Belgische specialist in montage, transport en kraanverhuur. Eén partner voor de volledige
          ruwbouw van hallen, loodsen en productieruimtes, overal in Europa.
        </p>
        <div className="cols">
          <div className="tile"><span className="num">2006</span><h3>Opgericht</h3><p>Gestart als montageploeg, gegroeid tot een volwaardige bouwpartner met eigen transport en kranen.</p></div>
          <div className="tile"><span className="num">3</span><h3>Diensten in eigen beheer</h3><p>Montage, transport en kraanverhuur: één ploeg, eigen vrachtwagen en eigen kranen.</p></div>
          <div className="tile"><span className="num">EU</span><h3>Werkgebied</h3><p>Gevestigd in België, actief op werven in heel Europa.</p></div>
        </div>
        <h2>Onze aanpak</h2>
        <div className="prose">
          <p>
            Elke werf begint met een gesprek. We bekijken samen het terrein, de planning en de constructie, en stellen
            één ploeg samen die het project van begin tot einde opvolgt. Zo weet u altijd wie er op de werf staat en wie
            u belt.
          </p>
          <p>
            Omdat we montage, transport en kraanwerk in eigen beheer hebben, zitten er geen wachttijden tussen de fases.
            Wat vandaag aankomt, staat morgen recht.
          </p>
        </div>
        <p className="note">Voorbeeldtekst — vervang door de echte bedrijfsgeschiedenis en cijfers van Vemontra.</p>
      </div>
    </section>
  )
}
