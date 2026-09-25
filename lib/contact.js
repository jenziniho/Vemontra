// Shared by the contact form (browser) and the e-mail route (server)

export const SERVICE_OPTIONS = ['Montage', 'Kraanverhuur', 'Transport']

export const LIMITS = { name: 120, company: 120, email: 200, phone: 40, location: 200, date: 20, message: 5000 }

const clip = (v, n) => String(v ?? '').trim().slice(0, n)

/** Clean up what the visitor typed. Returns { data, error } — error is a Dutch message or null. */
export function cleanRequest(input) {
  const data = {
    name: clip(input.name, LIMITS.name),
    company: clip(input.company, LIMITS.company),
    email: clip(input.email, LIMITS.email),
    phone: clip(input.phone, LIMITS.phone),
    location: clip(input.location, LIMITS.location),
    date: clip(input.date, LIMITS.date),
    message: clip(input.message, LIMITS.message),
    services: (Array.isArray(input.services) ? input.services : []).filter((s) => SERVICE_OPTIONS.includes(s)),
  }
  if (!data.name || !data.email || !data.message) return { data, error: 'Vul minstens uw naam, e-mail en een omschrijving in.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { data, error: 'Dat e-mailadres lijkt niet te kloppen.' }
  return { data, error: null }
}

/** Subject and plain-text body of the e-mail Vemontra receives. */
export function composeMail(d) {
  const diensten = d.services.length ? d.services.join(', ') : 'Niet gespecifieerd'
  const subject = `Aanvraag via website: ${diensten}${d.company ? ` — ${d.company}` : ` — ${d.name}`}`
  const body = [
    `Naam: ${d.name}`,
    d.company ? `Bedrijf: ${d.company}` : null,
    `E-mail: ${d.email}`,
    d.phone ? `Telefoon: ${d.phone}` : null,
    `Diensten: ${diensten}`,
    d.date ? `Gewenste startdatum: ${d.date}` : null,
    d.location ? `Locatie werf: ${d.location}` : null,
    '',
    'Omschrijving:',
    d.message,
  ]
    .filter((l) => typeof l === 'string')
    .join('\n')
  return { subject, body }
}
