// Company details, used in the footer and on the contact page. Change them here, once.
// NOTE: these are example details — replace them with the real ones.
export const site = {
  name: 'Vemontra bv',
  tagline: 'Industriële oplossingen, van A tot Z.',
  email: 'info@vemontra.be',
  phone: '+32 470 00 00 00',
  vat: 'BE 0123.456.789',
  address: ['Industrielaan 12', '3500 Hasselt, België'],
  hours: 'Ma – vr, 7u00 – 17u00',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vemontra.be',
  socials: {
    linkedin: 'https://www.linkedin.com/',
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
  },
}

// Main navigation (header) — order as shown. `children` appear in a dropdown (desktop) or indented (phone).
export const nav = [
  { href: '/over-vemontra', label: 'Over Vemontra' },
  {
    href: '/wat-doet-vemontra',
    label: 'Wat doet Vemontra',
    children: [
      { href: '/wat-doet-vemontra', label: 'Montage en werkwijze' },
      { href: '/kraanverhuur', label: 'Kraanverhuur' },
      { href: '/transport', label: 'Transport' },
    ],
  },
  { href: '/projecten', label: 'Projecten' },
  { href: '/contact', label: 'Contact' },
]
