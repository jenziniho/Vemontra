import ContactForm from '@/components/ContactForm'
import { Slashes } from '@/components/Icons'
import { site } from '@/lib/site'

export const metadata = {
  title: 'Contact',
  description: 'Vraag een offerte aan voor montage, kraanverhuur of transport, of plan een afspraak.',
}

export default function ContactPage() {
  return (
    <section className="page">
      <div className="wrap">
        <p className="eyebrow"><Slashes size={20} /> Contact</p>
        <h1>Vertel ons wat u wilt bouwen.</h1>
        <p className="lede">
          Vink aan waarvoor u ons nodig hebt en beschrijf uw project. We nemen binnen één werkdag contact met u op.
        </p>
        <div className="book">
          <div className="book__form"><ContactForm variant="full" /></div>
          <aside className="info">
            <div className="item"><span className="k">E-mail</span><span className="v">{site.email}</span></div>
            <div className="item"><span className="k">Telefoon</span><span className="v">{site.phone}</span></div>
            <div className="item"><span className="k">Adres</span><span className="v">{site.address.join(', ')}</span></div>
            <div className="item"><span className="k">Bereikbaar</span><span className="v">{site.hours}</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}
