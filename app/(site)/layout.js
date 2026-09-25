// Layout for every public page: fonts, styles, header and footer
import '@fontsource/goldman/400.css'
import '@fontsource/goldman/700.css'
import '@fontsource/chonburi/400.css'
import '@fontsource/coda/400.css'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'
import Backdrop from '@/components/Backdrop'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a1d1d',
}

export default function SiteLayout({ children }) {
  return (
    <div className="site">
      <Backdrop />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <RevealObserver />
    </div>
  )
}
