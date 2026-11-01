import { useRef, useState } from 'react'
import MASCOTS from '../mascots.json'
import { ART_COLS } from '../mascot.mjs'

// Fluffy as the firmware draws him on the boot splash and screensaver
// (lib/core/src/ui/splash_layout.cpp: kArt, kMonsterWords, bubbleRows). His
// art and words are the first preset and the default phrases in mascots.json.
const ART = MASCOTS.presets[0].art
const WORDS = MASCOTS.phrases
const BUBBLE_TEXT = 18

function wrap(text, width) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    if (!line) line = word
    else if (line.length + 1 + word.length <= width) line += ' ' + word
    else { lines.push(line); line = word }
  }
  if (line) lines.push(line)
  return lines
}

function bubble(say) {
  const lines = wrap(say, BUBBLE_TEXT)
  const w = Math.max(...lines.map(l => l.length))
  return [
    '.' + '-'.repeat(w + 2) + '.',
    ...lines.map((l, i) => (i === 0 ? '< ' : '| ') + l.padEnd(w) + ' |'),
    "'" + '-'.repeat(w + 2) + "'",
  ]
}

// The art beside a bubble with `say`, row by row, as the splash lays them out.
export function splashRows(art, say) {
  const bub = bubble(say)
  return Array.from({ length: Math.max(art.length, bub.length) }, (_, i) => ({
    monster: (art[i] || '').padEnd(ART_COLS),
    bubble: bub[i] ? ' ' + bub[i] : '',
  }))
}

// Each word once per round, never the same twice running, as MonsterWords does.
function shuffled(last) {
  const order = WORDS.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  if (order[0] === last) [order[0], order[order.length - 1]] = [order[order.length - 1], order[0]]
  return order
}

export default function Fluffy() {
  const round = useRef(shuffled(-1))
  const [pos, setPos] = useState(0)
  const word = round.current[pos]

  const next = () => {
    if (pos + 1 >= WORDS.length) {
      round.current = shuffled(word)
      setPos(0)
    } else setPos(pos + 1)
  }

  const rows = splashRows(ART, WORDS[word])
  return (
    <figure className="fluffy">
      <button type="button" className="fluffy-art" onClick={next}
        aria-label={`Fluffy says: ${WORDS[word]} Press for another word.`}>
        <span aria-hidden="true">
          {rows.map((r, i) => (
            <span className="fluffy-row" key={i}>
              <span className="fluffy-monster">{r.monster}</span>
              {r.bubble}
            </span>
          ))}
        </span>
      </button>
      <figcaption>Fluffy, our mascot. He lives on the boot screen and the screensaver.</figcaption>
    </figure>
  )
}
