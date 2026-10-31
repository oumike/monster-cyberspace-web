import Bar from './Bar.jsx'
import { THEMES, SELF, nickColor } from '../themes.js'

export default function Themes({ current, onTheme }) {
  return (
    <section className="section" aria-labelledby="themes">
      <Bar id="themes" title="themes" count={THEMES.length} />
      <p className="intro">
        The same list as Settings &rsaquo; Theme. Twelve are cyberspace.online's
        own palettes, so the device can match the site. Pick one and this page
        changes to it.
      </p>
      <ul className="swatches">
        {THEMES.map(t => (
          <li key={t.id}>
            <button
              type="button"
              className="swatch"
              aria-pressed={t.id === current}
              onClick={() => onTheme(t.id)}
              style={{ background: t.bg, color: t.fg, '--sw-edge': t.edge }}
            >
              <span className="swatch-bar" style={{ background: t.bar, color: t.barFg }}>{t.label}</span>
              <span className="swatch-line">
                <span style={{ color: t.time }}>23:42 </span>
                <span style={{ color: nickColor(t, 'rain') }}>rain</span>: look outside
              </span>
              <span className="swatch-line" style={{ background: t.mention }}>
                <span style={{ color: t.time }}>23:43 </span>
                <span style={{ color: nickColor(t, 'moth') }}>moth</span>: @{SELF} hi
              </span>
              <span className="swatch-line">
                <span style={{ color: t.time }}>23:43 </span>
                <span style={{ color: t.self }}>{SELF}</span>: hello
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
