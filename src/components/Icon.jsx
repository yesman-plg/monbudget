/**
 * Icône Material Symbols (Google). `name` est le nom de symbole officiel
 * (ex. "home", "bolt", "savings") — voir fonts.google.com/icons.
 */
export default function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-rounded icon ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}
