// Root layout, shared by the website and the Sanity Studio at /studio
import { site } from '@/lib/site'

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Vemontra — montage, transport en kraanverhuur', template: '%s | Vemontra' },
  description:
    'Vemontra bv plaatst industriële gebouwen in heel Europa: montage, transport en kraanverhuur, van A tot Z. Sinds 2006.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>
        {/* Marks that JavaScript runs, so scroll animations may start hidden (see [data-reveal] in globals.css) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  )
}
