import { THEMES } from '../themes.js'

export default function TopBar({ theme, onTheme, canFlash }) {
  const links = [
    ['screens', 'screens'],
    ['themes', 'themes'],
    ['boards', 'boards'],
    ...(canFlash ? [['install', 'install']] : []),
    ['setup', 'setup'],
    ['docs', 'docs'],
  ]
  return (
    <header className="topbar">
      <a className="topbar-home" href="#main">monster</a>
      <nav aria-label="Sections">
        <ul>
          {links.map(([id, label]) => (
            <li key={id}><a href={`#${id}`}>{label}</a></li>
          ))}
        </ul>
      </nav>
      <label className="topbar-theme">
        <span>theme</span>
        <select value={theme.id} onChange={e => onTheme(e.target.value)}>
          {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </label>
    </header>
  )
}
