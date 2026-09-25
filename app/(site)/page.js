import Link from 'next/link'
import HeroImage from '@/components/HeroImage'
import HomeContact from '@/components/HomeContact'
import { ArrowIcon, Slashes } from '@/components/Icons'
import ProcessVideo from '@/components/ProcessVideo'
import ProjectShowcase from '@/components/ProjectShowcase'
import { sanityFetch } from '@/sanity/client'
import { SHOWCASE_QUERY } from '@/sanity/queries'

export const revalidate = 60

export default async function HomePage() {
  const showcase = await sanityFetch(SHOWCASE_QUERY, {}, null)

  return (
    <>
      <section className="hero" aria-label="Vemontra — montage, transport, kraanverhuur">
        <div className="hero__bg">
          <HeroImage />
        </div>
        <div className="wrap hero__inner">
          <h1 className="headline">
            <Link className="hl l1" href="/wat-doet-vemontra">MONTAGE</Link>
            <Link className="hl l2" href="/transport">TRANSPORT</Link>
            <Link className="hl l3" href="/kraanverhuur">KRAANVERHUUR</Link>
          </h1>
        </div>
        {/* Bottom-right corner of the photo */}
        <div className="founded">
          <div className="rule" aria-hidden="true" />
          <div className="label">
            <Slashes />
            <span>Opgericht in<br />2006</span>
          </div>
        </div>
      </section>

      <section className="about" id="over">
        <div className="wrap about__grid" data-reveal="left">
          <div>
            <p className="about__loc">
              <Slashes />
              <span>Gelocaliseerd in<br />België</span>
            </p>
            <h2>Werven met de <em>hoogste kwaliteit</em> binnen Europa.</h2>
            <Link className="btn btn--ghost" href="/over-vemontra">Over ons <ArrowIcon /></Link>
          </div>
          <figure className="about__img" style={{ margin: 0 }}>
            <img
              src="/assets/bld.webp"
              alt="Betonnen wanden en stalen spanten van een industrieel gebouw in opbouw"
              width="2000"
              height="1116"
              loading="lazy"
            />
            <figcaption>Vemontra is een bedrijf dat zich voornamelijk richt op het plaatsen van industriële gebouwen.</figcaption>
          </figure>
        </div>
      </section>

      {/* Big clickable projects section; uses the site's own photos until projects are added in Sanity */}
      <ProjectShowcase data={showcase} />

      {/* The video locks the page while it plays, so it comes after the rest of the content */}
      <ProcessVideo />

      {/* Contact box: the form e-mails the request to Vemontra */}
      <HomeContact />
    </>
  )
}
