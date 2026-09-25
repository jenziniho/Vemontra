// Builds a fully static copy of the website in `out/` (for Surge or any plain web host).
//   npm run build:static     then     npx surge out vemontra-preview.surge.sh
// A static host can't run server code, so two parts are left out of this version:
//   - /studio (manage content at localhost:3000/studio, or with `npx sanity deploy`)
//   - /api/contact (the contact form then prepares the e-mail in the visitor's own mail app)
// Sanity content is baked in at build time: after adding projects, cranes or trailers, build and upload again.
import { execSync } from 'node:child_process'
import { existsSync, renameSync, rmSync } from 'node:fs'

const aside = [
  ['app/api', '.static-aside-api'],
  ['app/studio', '.static-aside-studio'],
]
for (const [from, to] of aside) if (existsSync(from)) renameSync(from, to)
let failed = false
try {
  rmSync('.next', { recursive: true, force: true })
  execSync('npx next build', { stdio: 'inherit', env: { ...process.env, STATIC_EXPORT: '1' } })
} catch {
  failed = true
} finally {
  for (const [from, to] of aside) if (existsSync(to)) renameSync(to, from)
  rmSync('.next', { recursive: true, force: true }) // so the next `npm run dev` starts clean
}
if (failed) process.exit(1)
console.log('\nKlaar! De statische site staat in de map "out". Zet hem online met:  npx surge out vemontra-preview.surge.sh\n')
