'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { cleanRequest, composeMail, SERVICE_OPTIONS } from '@/lib/contact'
import { site } from '@/lib/site'
import { ArrowIcon } from './Icons'

/**
 * Contact / booking form, used on the homepage (variant "compact") and the Contact page (variant "full").
 * It sends the request to /api/contact, which e-mails Vemontra. If e-mail sending isn't set up yet
 * (or fails), it prepares the e-mail for the visitor's own mail app instead, so no request gets lost.
 */
export default function ContactForm({ variant = 'full' }) {
  const uid = useId()
  const id = (name) => `${uid}-${name}`
  const full = variant === 'full'
  const [services, setServices] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | sent | fallback
  const [error, setError] = useState('')
  const [mail, setMail] = useState(null)
  const [sentName, setSentName] = useState('')
  const [toast, setToast] = useState('')
  const msgRef = useRef(null)
  const preRef = useRef(null)
  const toastTimer = useRef(null)

  // Coming from a "Deze kraan huren" / "Transport aanvragen" button: tick the service and name the item
  useEffect(() => {
    if (!full) return
    const q = new URLSearchParams(window.location.search)
    const dienst = q.get('dienst')
    const match = dienst && SERVICE_OPTIONS.find((s) => s.toLowerCase() === dienst.toLowerCase())
    if (match) setServices([match])
    const item = q.get('item')
    if (item && msgRef.current && !msgRef.current.value) msgRef.current.value = `Interesse in: ${item}\n\n`
  }, [full])

  const toggle = (s) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const raw = { ...Object.fromEntries(new FormData(form).entries()), services }
    const { data, error: problem } = cleanRequest(raw)
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setStatus('sending')
    let ok = false
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: raw.website || '' }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 400 && json.error) {
        setError(json.error)
        setStatus('idle')
        return
      }
      ok = res.ok && json.ok
    } catch {
      ok = false
    }
    if (ok) {
      setSentName(data.name.split(' ')[0])
      setStatus('sent')
      form.reset()
      setServices([])
    } else {
      // Not set up yet or temporarily unavailable: let the visitor send it from their own mail app
      setMail(composeMail(data))
      setStatus('fallback')
    }
  }

  async function copy() {
    const text = preRef.current?.textContent || ''
    try {
      await navigator.clipboard.writeText(text)
      showToast('Gekopieerd')
    } catch {
      const r = document.createRange()
      r.selectNodeContents(preRef.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(r)
      showToast('Tekst geselecteerd — druk op Ctrl/Cmd + C')
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-done" role="status">
        <span className="form-done__check" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h3>Bedankt{sentName ? `, ${sentName}` : ''}!</h3>
        <p>Uw aanvraag is verstuurd. We nemen binnen één werkdag contact met u op.</p>
        <button type="button" className="linkbtn" onClick={() => setStatus('idle')}>Nog een aanvraag versturen</button>
      </div>
    )
  }

  const mailto = mail
    ? `mailto:${site.email}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`
    : '#'

  return (
    <>
      <form className={`f f--${variant}`} onSubmit={handleSubmit} noValidate>
        <fieldset className="svc">
          <legend>Waarvoor contacteert u ons? <span>(meerdere mogelijk)</span></legend>
          <div className="svc__opts">
            {SERVICE_OPTIONS.map((s) => (
              <label key={s} className={`svc__opt${services.includes(s) ? ' is-on' : ''}`}>
                <input type="checkbox" id={id(`svc-${s}`)} checked={services.includes(s)} onChange={() => toggle(s)} />
                <span className="svc__box" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="row">
          <label>Naam <input type="text" id={id('name')} name="name" autoComplete="name" required /></label>
          <label>E-mail <input type="email" id={id('email')} name="email" autoComplete="email" required /></label>
        </div>
        <div className="row">
          <label><span>Telefoon <span className="opt">(optioneel)</span></span><input type="tel" id={id('phone')} name="phone" autoComplete="tel" /></label>
          {full
            ? <label><span>Bedrijf <span className="opt">(optioneel)</span></span><input type="text" id={id('company')} name="company" autoComplete="organization" /></label>
            : <label><span>Locatie van de werf <span className="opt">(optioneel)</span></span><input type="text" id={id('location')} name="location" placeholder="Gemeente" /></label>}
        </div>
        {full && (
          <div className="row">
            <label><span>Locatie van de werf <span className="opt">(optioneel)</span></span><input type="text" id={id('location')} name="location" placeholder="Gemeente of adres" /></label>
            <label><span>Gewenste startdatum <span className="opt">(optioneel)</span></span><input type="date" id={id('date')} name="date" /></label>
          </div>
        )}
        <label>
          Wat wilt u precies?
          <textarea
            ref={msgRef}
            id={id('message')}
            name="message"
            placeholder="Type gebouw, afmetingen, wat er vervoerd of gehesen moet worden, planning…"
            required
          />
        </label>
        {/* Honeypot against spam bots: hidden from people, ignored by screen readers */}
        <div className="hp" aria-hidden="true">
          <label>Website <input type="text" id={id('website')} name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div className="actions">
          <button className="btn btn--sm" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Versturen…' : 'Aanvraag versturen'} <ArrowIcon />
          </button>
          {error && <span className="err" role="alert">{error}</span>}
        </div>
      </form>

      {status === 'fallback' && mail && (
        <div className="out">
          <h3>Verstuur uw aanvraag via e-mail</h3>
          <p className="note" style={{ margin: 0 }}>
            Het formulier kon niet rechtstreeks verzonden worden. Uw e-mail staat klaar: open hem in uw e-mailprogramma
            of kopieer de tekst naar <strong>{site.email}</strong>.
          </p>
          <pre ref={preRef}>{`Aan: ${site.email}\nOnderwerp: ${mail.subject}\n\n${mail.body}`}</pre>
          <div className="toolbar">
            <a className="btn btn--sm" href={mailto}>Open in e-mailprogramma <ArrowIcon /></a>
            <button className="btn btn--sm btn--ghost" type="button" onClick={copy}>Kopieer tekst</button>
          </div>
        </div>
      )}
      <div className={`toast${toast ? ' show' : ''}`} role="status">{toast}</div>
    </>
  )
}
