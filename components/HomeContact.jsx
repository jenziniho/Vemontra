import { site } from '@/lib/site'
import ContactForm from './ContactForm'
import { Slashes } from './Icons'

/** Contact section at the bottom of the homepage. */
export default function HomeContact() {
  return (
    <section className="homecontact" id="contact" aria-labelledby="homecontact-title">
      <div className="wrap homecontact__grid" data-reveal="right">
        <div className="homecontact__intro">
          <p className="eyebrow"><Slashes size={20} /> Contact</p>
          <h2 id="homecontact-title">Een project <em>in de planning</em>?</h2>
          <p className="homecontact__text">
            Montage, een kraan of transport nodig? Vink aan wat u zoekt, beschrijf kort uw project en we nemen binnen
            één werkdag contact met u op.
          </p>
          <dl className="homecontact__details">
            <div><dt>Telefoon</dt><dd>{site.phone}</dd></div>
            <div><dt>E-mail</dt><dd>{site.email}</dd></div>
          </dl>
        </div>
        <div className="homecontact__form">
          <ContactForm variant="compact" />
        </div>
      </div>
    </section>
  )
}
