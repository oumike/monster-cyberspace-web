import { useRef, useState } from 'react'
import Bar from './Bar.jsx'
import { SCREENS } from '../screens.js'

// A list with a cursor, like every list on the device: Up/Down move it and
// wrap round at the ends.
export default function Screens() {
  const [index, setIndex] = useState(2)
  const buttons = useRef([])
  const current = SCREENS[index]

  function onKeyDown(e) {
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + SCREENS.length) % SCREENS.length
    setIndex(next)
    buttons.current[next]?.focus()
  }

  return (
    <section className="section" aria-labelledby="screens">
      <Bar id="screens" title="screens" count={SCREENS.length} />
      <p className="intro">
        From the demo build on an Attaky Mesh Deck: made-up users, real
        screens. Use the arrow keys or pick one.
      </p>
      <div className="screens">
        <ul className="list" onKeyDown={onKeyDown}>
          {SCREENS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                ref={el => { buttons.current[i] = el }}
                className={i === index ? 'row row-cursor' : 'row'}
                aria-pressed={i === index}
                tabIndex={i === index ? 0 : -1}
                onClick={() => setIndex(i)}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
        <figure className="shot">
          <img src={current.src} width="640" height="480" alt={`${current.title} screen`} />
          <figcaption>{current.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
