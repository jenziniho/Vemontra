// Sanity connection settings, read from environment variables (.env.local locally, Vercel settings online)
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2026-09-01'

// True once a project ID has been filled in. Until then the site runs without projects.
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)
