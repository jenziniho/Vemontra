# Vemontra website

The Vemontra bv website, built with **Next.js** (React, JavaScript) and **Sanity** as the CMS.
Projects (photos + details) are managed by Vemontra itself in the Sanity Studio at **`/studio`**.
Everything else (texts, contact details) lives in the code.

---

## 1. Run it on your computer

You need **Node.js 20 or newer** ([nodejs.org](https://nodejs.org), pick "LTS").

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The site already works without Sanity; the Projects page shows
"Binnenkort vindt u hier onze realisaties" until Sanity is connected.

## 2. Create the Sanity project (one time, free)

1. Go to <https://www.sanity.io> and sign up (Google account or e-mail). Use an account the company
   keeps long-term, because this account owns the content.
2. Go to <https://www.sanity.io/manage> → **Create new project**. Name it `Vemontra`.
   When asked for a dataset, use **`production`** (public).
3. On the project page, copy the **Project ID** (8 characters, e.g. `ab12cd34`).
4. In this folder, copy `.env.example` to a new file called **`.env.local`** and fill it in:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=ab12cd34
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

5. Back in sanity.io/manage → your project → **API** → **CORS origins** → **Add CORS origin**:
   `http://localhost:3000`, with **Allow credentials** ticked. (Later you add the live address too, see step 4.)
6. Restart `npm run dev` and open <http://localhost:3000/studio>. Log in with the same account.

## 3. Adding a project (for your dad)

1. Go to **www.vemontra.be/studio** (or `localhost:3000/studio` while testing) and log in.
2. Click **Projecten** → the **✎ / +** button to create one.
3. Fill in the name, click **Generate** next to "Webadres", upload the **Hoofdfoto**, and drag the other photos into **Foto's**.
   Type, location, year, m² and description are optional but make the page much better.
4. Click **Publish** (bottom right). The project appears on the website within about a minute.

The **Type gebouw** decides under which icon the project appears on the Projects page (and on the homepage).

Tips: on the main photo, the **hotspot** tool (the crop icon) sets which part stays visible when the photo is cropped.
Photos straight from a phone are fine; Sanity resizes them automatically.

### Adding a crane (Kraanverhuur) or a trailer/truck (Transport)

In the Studio, click **Kranen (Kraanverhuur)** or **Opleggers en vrachtwagens (Transport)** → **+**.
Fill in the name/model, click **Generate** for the web address, pick the kind, upload the main photo, and fill in the
specs you know (all in ton or metres). Anything that has no field of its own goes under **Extra specificaties**
(e.g. "Aantal assen" → "4"). Extra photos go in **Meer foto's**. Click **Publish**.

- Cranes appear on **/kraanverhuur**, trailers on **/transport**, each with its own detail page.
- Use **Volgorde** (1, 2, 3…) to set the order on the page.
- The "…aanvragen/huren" button on a detail page opens the contact form with the service and the model already filled in.

To give your dad his own login: sanity.io/manage → project → **Members** → **Invite**, role **Editor**.

## 4. Put it online (Vercel, free for this size)

1. Put this folder in a GitHub repository (without `node_modules` and `.env.local`; `.gitignore` already excludes them).
2. Go to <https://vercel.com>, sign in with GitHub, **Add New → Project**, pick the repository.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
   (same values as in `.env.local`), and `NEXT_PUBLIC_SITE_URL` = `https://www.vemontra.be`. Click **Deploy**.
4. Connect the domain in Vercel (**Settings → Domains**) and follow its DNS instructions at your domain registrar.
5. In sanity.io/manage → **API → CORS origins**, add `https://www.vemontra.be` (and the `*.vercel.app` address),
   with **Allow credentials** ticked. Otherwise the Studio can't log in on the live site.

Every push to GitHub redeploys automatically. Projects added in the Studio do **not** need a redeploy.

## 4b. Quick temporary preview on Surge (static)

Surge only hosts plain files, so this version skips `/studio` and the e-mail route: the contact form then opens the
e-mail in the visitor's own mail app. Sanity content is copied in when you build, so run both steps again after
adding projects, cranes or trailers. For the real site, use Vercel (step 4).

```bash
npx surge login                                  (first time only: creates your Surge account)
npm run build:static
npx surge out vemontra-preview.surge.sh
```

Then open https://vemontra-preview.surge.sh. If that name is taken, pick another one ending in `.surge.sh`.
Use the same address every time to update it. To take it offline: `npx surge teardown vemontra-preview.surge.sh`.

## 5. Make the contact form e-mail your dad (Resend, free up to 3,000 mails/month)

The contact forms (homepage and /contact) send requests through a small route on the site (`app/api/contact/route.js`)
to **Resend**, which delivers them to the company inbox. Until this is set up, the form still works: it prepares
the e-mail in the visitor's own mail app instead.

1. Create a free account at <https://resend.com> (with the company e-mail).
2. **Domains → Add domain** → `vemontra.be`. Resend shows a few DNS records; add them where the domain is managed
   (the registrar). After verification, mails come from an address @vemontra.be and don't land in spam.
3. **API Keys → Create API key** (permission "Sending access"). Copy it.
4. Add to `.env.local` (and in Vercel → Settings → Environment Variables):
   ```
   RESEND_API_KEY=re_...
   CONTACT_TO_EMAIL=info@vemontra.be          (where requests should arrive)
   CONTACT_FROM_EMAIL="Vemontra website <website@vemontra.be>"
   ```
5. Restart (`npm run dev`) or redeploy, send a test request from the homepage.

Replying to a request in the mailbox replies straight to the visitor (their address is set as reply-to).
Spam protection: a hidden "honeypot" field that bots fill in and people don't.

---

## Where things are

```
app/
  layout.js                 root layout (page titles, language)
  globals.css               all styling — colours and fonts at the top (:root)
  (site)/                   the public website (shares header + footer)
    layout.js               fonts, header, footer
    page.js                 homepage (full-screen hero, about, project panels, bouwproces video, contact box)
    over-vemontra/page.js
    wat-doet-vemontra/page.js
    kraanverhuur/page.js, kraanverhuur/[slug]/page.js   cranes (from Sanity)
    transport/page.js, transport/[slug]/page.js         trailers and truck (from Sanity)
    projecten/page.js       list of projects (from Sanity)
    projecten/[slug]/page.js  one project page with photo gallery
    contact/page.js
  studio/[[...tool]]/page.js  the Sanity Studio at /studio
  api/contact/route.js      sends contact-form requests by e-mail (Resend)
  sitemap.js, robots.js     for Google
scripts/build-static.mjs    `npm run build:static` → static copy in out/ (for Surge)
components/
  Header.jsx, Footer.jsx
  ProcessVideo.jsx          the scroll-locked video + four phase bars + "Overslaan" button (phase names at the top)
  ProjectShowcase.jsx       homepage projects section; ProjectPanels.jsx = the expanding photo panels
  ProjectsBrowser.jsx       Projects page grid with the building-type filter
  BuildingTypeIcon.jsx      the icons per building type
  FleetCard.jsx, FleetGrid.jsx, FleetDetail.jsx   cards and detail page for cranes and trailers
  ContactForm.jsx           the contact form (homepage + contact page); HomeContact.jsx = homepage section
  HeroImage.jsx             the hero photo in 4 sizes (phone → 4K screen)
  Backdrop.jsx              the page background: grid, copper light and line drawings of steel structures
  RevealObserver.jsx        the slide animations, both scrolling down and up (add data-reveal="left" or "right" to any block)
  ProjectCard.jsx, ProjectGallery.jsx, SanityImage.jsx
lib/site.js                 company details (phone, e-mail, BTW, address, socials) — change them here
lib/buildingTypes.js        the building types (names, plural, web address) used everywhere
lib/fleet.js                crane and trailer kinds, and which specs are shown
lib/contact.js              the services you can tick in the form, and the e-mail layout
sanity/
  schemaTypes/project.js    the fields your dad sees when adding a project
  schemaTypes/crane.js, trailer.js, fleetFields.js   the fields for cranes and trailers
  queries.js                what the website asks Sanity for
  env.js, client.js, image.js
sanity.config.js            Studio settings
public/assets/              logo, photos, icon, bouwproces video
app/favicon.ico, icon.svg, apple-icon.png   the "V" website icon (browser tab, phone home screen); manifest.js
```

**Common changes**

- Phone, e-mail, address, BTW → `lib/site.js`
- Page texts → the `page.js` of that page
- The video → replace `public/assets/bouwproces.mp4` (same name). Phase timing follows the video's length.
- The hero photo → make 1280/1920/2560/3840 px wide versions, put them in `public/assets/`, update `components/HeroImage.jsx`
- Phase names → `PHASE_LABELS` in `components/ProcessVideo.jsx`
- Add a building type → add it to `lib/buildingTypes.js` and draw its icon in `components/BuildingTypeIcon.jsx`
  (keep the existing `value`s unchanged, they're stored with the projects)
- Colours / fonts → top of `app/globals.css`
- The background (grid, drawings, glow) → `components/Backdrop.jsx` and the "Backdrop" part at the bottom of `app/globals.css`
- Space between homepage sections → `--section-gap` at the top of `app/globals.css` (one value for all)
- Add a field to projects (e.g. "Hoogte") → `sanity/schemaTypes/project.js`, then show it in
  `app/(site)/projecten/[slug]/page.js` and add it to `PROJECT_QUERY` in `sanity/queries.js`

**Notes**

- Fonts are self-hosted (`@fontsource/*` packages), so visitors' browsers don't contact Google (GDPR-friendly).
- Pages refresh their Sanity content at most every 60 seconds (`revalidate = 60`).
- The homepage photo panels use the site's own photos until there are at least 3 projects with a main photo.
- The menu item "Wat doet Vemontra" has a dropdown (Montage en werkwijze, Kraanverhuur, Transport); edit it in `lib/site.js`.
- The Projects filter keeps its choice in the address (`/projecten?type=loods`), so you can link straight to one type.
- Contact details and the texts on Over/Wat doet are still examples — replace them with the real ones.
