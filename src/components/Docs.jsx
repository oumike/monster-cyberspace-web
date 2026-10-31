import Bar from './Bar.jsx'

const GH = 'https://github.com/oumike/monster-cyberspace'
const DOCS = [
  [`${GH}/blob/main/docs/USE.md`, 'Using it', 'Setup, buttons, touch, rooms, C-Mail, the Feed, web config'],
  [`${GH}/blob/main/docs/BUILD.md`, 'Building', 'Compile it yourself with PlatformIO'],
  [`${GH}/blob/main/docs/TESTING.md`, 'Testing', 'Unit tests and the hardware checklist'],
  [`${GH}/releases`, 'Releases', 'Every image, with flash.sh and checksums'],
  [`${GH}/issues`, 'Issues', 'Report a bug or ask for a board'],
  [GH, 'Source', 'GPL-3.0, on GitHub'],
]

export default function Docs() {
  return (
    <section className="section" aria-labelledby="docs">
      <Bar id="docs" title="docs" />
      <dl className="docs">
        {DOCS.map(([href, title, desc]) => (
          <div key={title}>
            <dt><a href={href}>{title}</a></dt>
            <dd>{desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
