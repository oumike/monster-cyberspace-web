import { useEffect, useMemo, useState } from 'react'
import { SELF, nickColor } from '../themes.js'

// #general on a 640x480 panel in the 16x32 cell font: 40 columns, 15 rows.
// Status bar, thirteen log rows, input line. Lines are from the firmware's
// demo source (src/chat/fake_chat_source.cpp), so the users are made up.
const COLS = 40
const LOG_ROWS = 13
const INDENT = 6 // "23:43 " — continuation rows start under the nick
const TYPED = 'just flashed it from the browser'

const LOG = [
  { t: '23:31', nick: 'lumen', text: "it's raining here again" },
  { t: '23:33', nick: 'zed', text: 'does anyone remember the old BBS door games' },
  { t: '23:34', nick: 'sable', text: 'brb, coffee' },
  { t: '23:36', nick: 'ferrous', text: 'the terminal font on this thing is crisp' },
  { t: '23:37', nick: 'genghis', text: 'has anyone tried the new feed layout' },
  { t: '23:39', nick: 'orbit', text: 'lol' },
  { t: '23:41', nick: 'kiwi', text: 'i keep typing ls in the chat box' },
  { t: '23:43', nick: 'sable', text: '@oumike are you there? check this out', mention: true },
  { t: '23:43', nick: 'rain', text: 'anyone else on a handheld right now?' },
]

// Word-wraps one message into rows of coloured runs, the way the room log
// does: time, nick, then the text, with continuation rows indented.
function wrap(msg, theme) {
  const rows = [[
    { s: `${msg.t} `, c: theme.time },
    { s: msg.nick, c: nickColor(theme, msg.nick) },
    { s: ': ', c: theme.fg },
  ]]
  let col = INDENT + msg.nick.length + 2
  let fresh = true
  for (const word of msg.text.split(' ')) {
    let sep = fresh ? '' : ' '
    if (col + sep.length + word.length > COLS) {
      rows.push([{ s: ' '.repeat(INDENT), c: theme.fg }])
      col = INDENT
      sep = ''
    }
    rows[rows.length - 1].push({ s: sep + word, c: theme.fg })
    col += sep.length + word.length
    fresh = false
  }
  return rows.map(runs => ({ runs, mention: !!msg.mention }))
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function RoomSim({ theme }) {
  // The one moment of motion on the page: a line is typed and sent.
  const reduced = prefersReducedMotion()
  const [typed, setTyped] = useState(reduced ? TYPED.length : 0)
  const [sent, setSent] = useState(reduced)

  useEffect(() => {
    if (reduced) return undefined
    const timers = []
    const start = 1200
    for (let i = 1; i <= TYPED.length; i += 1) {
      timers.push(setTimeout(() => setTyped(i), start + i * 75 + (i % 5 === 0 ? 40 : 0)))
    }
    timers.push(setTimeout(() => setSent(true), start + TYPED.length * 75 + 700))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const rows = useMemo(() => {
    const msgs = sent ? [...LOG, { t: '23:43', nick: SELF, text: TYPED }] : LOG
    return msgs.flatMap(m => wrap(m, theme)).slice(-LOG_ROWS)
  }, [theme, sent])

  const input = sent ? '' : TYPED.slice(0, typed)

  return (
    <figure className="sim" aria-label="A cIRC room on the device">
      <div className="sim-screen" aria-hidden="true">
        <div className="sim-row sim-status">
          <span>&lsaquo; #general 12</span>
          <span>&bull; &#x2582;&#x2584;&#x2586;&#x2588; 89% 23:43</span>
        </div>
        {Array.from({ length: LOG_ROWS - rows.length }, (_, i) => (
          <div className="sim-row" key={`pad${i}`}>&nbsp;</div>
        ))}
        {rows.map((row, i) => (
          <div className={`sim-row${row.mention ? ' sim-mention' : ''}`} key={i}>
            {row.runs.map((r, j) => <span key={j} style={{ color: r.c }}>{r.s}</span>)}
          </div>
        ))}
        <div className="sim-row sim-input">
          <span className="sim-prompt">&gt; </span>{input}<span className="sim-cursor">&nbsp;</span>
        </div>
      </div>
      <figcaption>
        A room as the firmware draws it, in the {theme.label} theme.
      </figcaption>
    </figure>
  )
}
