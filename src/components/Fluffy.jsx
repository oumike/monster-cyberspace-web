import { useRef, useState } from 'react'

// Fluffy as the firmware draws him on the boot splash and screensaver
// (lib/core/src/ui/splash_layout.cpp: kArt, kMonsterWords, bubbleRows).
const ART = [
  ' /\\       /\\',
  "/  '-----'  \\",
  '|  (o) (o)  |',
  '|   .VVV.   |',
  " \\  '^^^'  /",
  "  '-.___.-'",
]
const ART_W = 13
const WORDS = [
  'boo', 'moo', 'bop!', 'meow', 'hi!',
  "We've been trying to reach you about your car's extended warranty.",
]
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

  const bub = bubble(WORDS[word])
  const rows = Math.max(ART.length, bub.length)
  return (
    <figure className="fluffy">
      <button type="button" className="fluffy-art" onClick={next}
        aria-label={`Fluffy says: ${WORDS[word]} Press for another word.`}>
        <span aria-hidden="true">
          {Array.from({ length: rows }, (_, i) => (
            <span className="fluffy-row" key={i}>
              <span className="fluffy-monster">{(ART[i] || '').padEnd(ART_W)}</span>
              {bub[i] ? ' ' + bub[i] : ''}
            </span>
          ))}
        </span>
      </button>
      <figcaption>Fluffy, our mascot. He lives on the boot screen and the screensaver.</figcaption>
    </figure>
  )
}
