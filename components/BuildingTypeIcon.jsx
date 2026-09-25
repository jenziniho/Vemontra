/**
 * Line icons for the building types, drawn for Vemontra.
 * The outline uses the text colour, the details (doors, windows, bracing) use the orange accent.
 */
const ICONS = {
  // Gable-roofed warehouse with a roller door
  magazijn: (
    <>
      <path d="M8 54V26L32 12l24 14v28" />
      <path className="acc" d="M21 54V33h22v21M21 38.5h22M21 44h22M21 49.5h22" />
    </>
  ),
  // Long, low logistics hall with three loading docks
  'logistieke-hal': (
    <>
      <path d="M4 54V29l6-7h44l6 7v25M4 29h56" />
      <path className="acc" d="M10 54V40h10v14M27 54V40h10v14M44 54V40h10v14" />
    </>
  ),
  // Production hall with a sawtooth roof and a chimney
  productiehal: (
    <>
      <path d="M6 54V32l12-10v10l12-10v10l12-10v10h16v22" />
      <path d="M47 32V12h6v20" />
      <path className="acc" d="M12 54V42h10v12M29 41h7v6h-7zM45 41h7v6h-7z" />
    </>
  ),
  // Office block next to a workshop
  'kantoren-werkplaats': (
    <>
      <path d="M8 54V12h20v42M28 54V31l14-9 14 9v23" />
      <path className="acc" d="M13 18h10M13 26h10M13 34h10M13 42h10M36 54V41h12v13" />
    </>
  ),
  // Shed with an arched roof and a braced double door
  loods: (
    <>
      <path d="M10 54V31C10 18 20 12 32 12s22 6 22 19v23" />
      <path className="acc" d="M21 54V36h22v18M32 36v18M21 36l11 18M43 36 32 54" />
    </>
  ),
  // Bare steel frame with cross bracing (a structure in assembly)
  andere: (
    <>
      <path d="M12 54V28l20-12 20 12v26M32 16v38M12 28h40" />
      <path className="acc" d="M12 28l20 26M32 28 12 54M32 28l20 26M52 28 32 54" />
    </>
  ),
  // "All projects": a small grid of buildings
  alle: (
    <>
      <path d="M8 30V18l8-5 8 5v12M40 30V18l8-5 8 5v12M8 54V42l8-5 8 5v12M40 54V42l8-5 8 5v12" />
      <path className="ground" d="M2 30h60" />
      <path className="acc" d="M13 30v-6h6v6M45 30v-6h6v6M13 54v-6h6v6M45 54v-6h6v6" />
    </>
  ),
}

export default function BuildingTypeIcon({ slug, size = 48, className = '', title }) {
  const icon = ICONS[slug] || ICONS.andere
  return (
    <svg
      className={`btype-icon ${className}`}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path className="ground" d="M2 54h60" />
      {icon}
    </svg>
  )
}
