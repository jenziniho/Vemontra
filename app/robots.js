export const dynamic = 'force-static'

import { site } from '@/lib/site'

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/studio' },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
