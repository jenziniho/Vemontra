/**
 * Receives the contact form and e-mails it to Vemontra through Resend (https://resend.com).
 * Needs three settings (in .env.local, and in Vercel when online):
 *   RESEND_API_KEY      the key from resend.com → API Keys
 *   CONTACT_TO_EMAIL    where requests arrive, e.g. info@vemontra.be
 *   CONTACT_FROM_EMAIL  sender, e.g. "Vemontra website <website@vemontra.be>" (domain verified in Resend)
 * Without them the route answers 503 and the form falls back to preparing the e-mail in the visitor's mail app.
 */
import { cleanRequest, composeMail } from '@/lib/contact'

export async function POST(request) {
  let input
  try {
    input = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Ongeldige aanvraag.' }, { status: 400 })
  }

  // Honeypot: a hidden field real visitors never fill in. Bots do — pretend it worked.
  if (input?.website) return Response.json({ ok: true })

  const { data, error } = cleanRequest(input || {})
  if (error) return Response.json({ ok: false, error }, { status: 400 })

  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || 'Vemontra website <onboarding@resend.dev>'
  if (!key || !to) return Response.json({ ok: false, reason: 'not-configured' }, { status: 503 })

  const { subject, body } = composeMail(data)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text: body }),
    })
    if (!res.ok) {
      console.error('[contact] Resend error', res.status, await res.text())
      return Response.json({ ok: false, reason: 'send-failed' }, { status: 502 })
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed', err)
    return Response.json({ ok: false, reason: 'send-failed' }, { status: 502 })
  }
}
