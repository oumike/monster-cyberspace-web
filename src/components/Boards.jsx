import Bar from './Bar.jsx'
import { BOARDS } from '../boards.js'
import { versionsFor } from '../firmware.js'

export default function Boards({ catalog }) {
  // A board shows "not released yet" only once the release list is known.
  const released = slug => !catalog || catalog.failed || versionsFor(catalog.items, slug).length > 0
  return (
    <section className="section" aria-labelledby="boards">
      <Bar id="boards" title="boards" count={BOARDS.length} />
      <p className="intro">
        One source tree, one image per board. Keys, touch or both: every screen
        works with whatever the board has.
      </p>
      <table className="boards">
        <thead>
          <tr><th scope="col"><span className="sr-only">Photo</span></th><th scope="col">board</th><th scope="col">input</th><th scope="col">screen</th></tr>
        </thead>
        <tbody>
          {BOARDS.map(b => (
            <tr key={b.slug}>
              <td className="boards-photo">
                {b.image ? <img src={b.image} alt="" loading="lazy" width="96" height="72" /> : <span className="no-photo" aria-hidden="true">?</span>}
              </td>
              <th scope="row">
                {b.name}
                {!released(b.slug) && <span className="pending"> not released yet</span>}
                {b.note && <span className="hint board-note">{b.note}</span>}
              </th>
              <td>{b.input}</td>
              <td>{b.screen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
