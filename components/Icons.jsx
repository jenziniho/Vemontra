// Small shared graphics

export function Slashes({ size }) {
  const style = size ? { width: size, height: (size * 26) / 31 } : undefined
  return (
    <svg className="slashes" viewBox="0 0 31 26" aria-hidden="true" style={style}>
      <path d="M.4 25.3 15.4.3M8.4 25.3 23.4.3M15.4 25.3 30.4.3" stroke="currentColor" fill="none" />
    </svg>
  )
}

// The "enter" arrow icon from the design, used on the action buttons
export function ArrowIcon() {
  return <img src="/assets/icon.webp" alt="" width="160" height="160" />
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z" />
    </svg>
  )
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5h1.5V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.6v7z" />
    </svg>
  )
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 3c-2.4 0-2.7 0-3.7.1-2.6.1-4.1 1.6-4.2 4.2C4 8.3 4 8.6 4 11v2c0 2.4 0 2.7.1 3.7.1 2.6 1.6 4.1 4.2 4.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c2.6-.1 4.1-1.6 4.2-4.2.1-1 .1-1.3.1-3.7v-2c0-2.4 0-2.7-.1-3.7-.1-2.6-1.6-4.1-4.2-4.2C14.7 3 14.4 3 12 3Zm0 1.8c2.4 0 2.6 0 3.6.1 1.7.1 2.5.9 2.6 2.6 0 .9.1 1.2.1 3.5v2c0 2.3 0 2.6-.1 3.5-.1 1.7-.9 2.5-2.6 2.6-1 0-1.2.1-3.6.1s-2.6 0-3.6-.1c-1.7-.1-2.5-.9-2.6-2.6 0-.9-.1-1.2-.1-3.5v-2c0-2.3 0-2.6.1-3.5.1-1.7.9-2.5 2.6-2.6 1-.1 1.2-.1 3.6-.1Z" />
    </svg>
  )
}
