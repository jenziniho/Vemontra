import Link from 'next/link'
import { site } from '@/lib/site'
import { ArrowIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <h4>{site.name}</h4>
            <p className="lead">
              {site.tagline} Montage, transport en kraanverhuur voor industriële gebouwen in heel Europa.
            </p>
            <div className="socials">
              <a href={site.socials.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href={site.socials.facebook} target="_blank" rel="noopener" aria-label="Facebook"><FacebookIcon /></a>
              <a href={site.socials.instagram} target="_blank" rel="noopener" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
          <div>
            <h4>Sitemap</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/over-vemontra">Over Vemontra</Link></li>
              <li><Link href="/wat-doet-vemontra">Wat doet Vemontra</Link></li>
              <li><Link href="/kraanverhuur">Kraanverhuur</Link></li>
              <li><Link href="/transport">Transport</Link></li>
              <li><Link href="/projecten">Projecten</Link></li>
              <li><span style={{ color: 'var(--muted)' }}>Vacatures (binnenkort)</span></li>
            </ul>
          </div>
          <div>
            <h4>Gegevens</h4>
            <div className="kv">
              <div><small>Telefoon</small><span>{site.phone}</span></div>
              <div><small>E-mail</small><span>{site.email}</span></div>
              <div><small>BTW</small><span>{site.vat}</span></div>
              <div><small>Adres</small><span>{site.address[0]}<br />{site.address[1]}</span></div>
            </div>
          </div>
          <div className="footer__contact">
            <h4>Contact</h4>
            <p className="lead">
              Een project in de planning? Vertel ons wat u wilt bouwen en we nemen binnen één werkdag contact op.
            </p>
            <Link className="btn btn--sm" href="/contact">Boek nu <ArrowIcon /></Link>
          </div>
        </div>
        <div className="footer__bottom">
          <Link href="/" aria-label="Vemontra — home">
            <img src="/assets/logo.webp" alt="Vemontra bv" width="934" height="158" />
          </Link>
          <div className="legal">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <Link href="/">Privacy</Link>
            <Link href="/">Algemene voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
