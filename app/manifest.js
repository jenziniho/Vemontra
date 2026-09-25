// Web app manifest: name, colours and the "V" icon when the site is added to a phone's home screen
export const dynamic = 'force-static'

export default function manifest() {
  return {
    name: 'Vemontra bv',
    short_name: 'Vemontra',
    start_url: '/',
    display: 'browser',
    background_color: '#1a1d1d',
    theme_color: '#1a1d1d',
    icons: [
      { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
