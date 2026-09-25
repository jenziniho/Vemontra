/** @type {import('next').NextConfig} */

// `npm run build:static` sets STATIC_EXPORT=1: the site is then exported as plain HTML files in `out/`
// (for simple static hosts such as Surge). The normal build (Vercel) is unchanged.
const isStatic = process.env.STATIC_EXPORT === '1'

const nextConfig = {
  ...(isStatic && { output: 'export', trailingSlash: true }),
  images: {
    // Photos uploaded in Sanity are served from Sanity's image CDN
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    ...(isStatic && { unoptimized: true }),
  },
}

export default nextConfig
