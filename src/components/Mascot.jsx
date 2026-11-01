import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import MASCOTS from '../mascots.json'
import {
  ART_ROWS, ART_COLS, MAX_PHRASES, PHRASE_MAX,
  blobMascot, cleanMascot, validateMascot,
} from '../mascot.mjs'
import { splashRows } from './Fluffy.jsx'

// The flasher's "Make your Fluffy" and "Phrases" dialogs (spec §5 of
// monster-cyberspace's 2026-10-31-cyberspace-fluffy-generator-design.md, as
// its site/fluffy.js). Install.jsx flashes the blob when either is changed.

export const PRESETS = MASCOTS.presets
export const DEFAULTS = { art: PRESETS[0].art, phrases: MASCOTS.phrases }

// Same key as the firmware repo's flasher, so a choice carries over.
const STORE_KEY = 'monster.fluffy'

const asciiOnly = s => s.replace(/[^\x20-\x7e]/g, '')
const isStrings = a => Array.isArray(a) && a.every(x => typeof x === 'string')

export function loadMascot() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY))
    if (s && isStrings(s.art) && isStrings(s.phrases)) {
      const c = cleanMascot(s)
      if (validateMascot(c) === '') {
        return {
          art: c.art.length ? c.art : [...DEFAULTS.art],
          phrases: c.phrases.length ? c.phrases : [...DEFAULTS.phrases],
        }
      }
    }
  } catch {}
  return { art: [...DEFAULTS.art], phrases: [...DEFAULTS.phrases] }
}

export function saveMascot(m) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(m)) } catch {}
}

// The line under Flash: what goes onto the board.
export function mascotStatus(m) {
  const b = blobMascot(m, DEFAULTS)
  const n = b.phrases.length
  const words = `${n} phrase${n === 1 ? '' : 's'}`
  if (!b.art.length && !n) return 'Flashes with Fluffy and his phrases.'
  if (!n) return "Flashes with your mascot and Fluffy's phrases."
  if (!b.art.length) return `Flashes with Fluffy and your ${words}.`
  return `Flashes with your mascot and ${words}.`
}

// A modal <dialog>, shown on mount. Esc and a click outside its box close it;
// every close goes through onClose, and focus goes back to `opener`.
function Modal({ title, opener, onClose, children }) {
  const ref = useRef(null)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    const d = ref.current
    const onDialogClose = () => {
      close.current()
      opener.current?.focus()
    }
    // Clicks on the dialog's own padding also target it; only outside its box closes.
    const onClick = e => {
      if (e.target !== d) return
      const r = d.getBoundingClientRect()
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close()
    }
    d.addEventListener('close', onDialogClose)
    d.addEventListener('click', onClick)
    d.showModal()
    return () => {
      d.removeEventListener('close', onDialogClose)
      d.removeEventListener('click', onClick)
      if (d.open) d.close()
    }
  }, [opener])

  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-title">
      <h3 id="modal-title" className="bar">{title}</h3>
      {children(() => ref.current.close())}
    </dialog>
  )
}

// A 13x6 editor that drops what can't be stored as it's typed or pasted:
// non-ASCII, a 14th column, a 7th line.
export function ArtDialog({ mascot, opener, onDone }) {
  const [text, setText] = useState(mascot.art.join('\n'))
  const [caret, setCaret] = useState(0)
  const area = useRef(null)
  const pending = useRef(null)
  const draft = useRef(text)
  draft.current = text

  useLayoutEffect(() => {
    if (pending.current == null) return
    area.current.setSelectionRange(pending.current, pending.current)
    pending.current = null
  })
  useEffect(() => { area.current.focus() }, [])

  const fix = s => s.split('\n').map(l => asciiOnly(l).slice(0, ART_COLS))
  const onChange = e => {
    const v = e.target.value
    const all = fix(v).slice(0, ART_ROWS).join('\n')
    const at = Math.min(fix(v.slice(0, e.target.selectionStart)).join('\n').length, all.length)
    if (all !== v) pending.current = at
    setText(all)
    setCaret(at)
  }
  const track = e => setCaret(e.target.selectionStart)
  const setArt = art => { setText(art.join('\n')); setCaret(0); area.current.focus() }

  const lines = text.split('\n')
  const upto = text.slice(0, caret).split('\n')
  const art = cleanMascot({ art: lines, phrases: [] }).art
  const rows = splashRows(art.length ? art : DEFAULTS.art, mascot.phrases[0] || DEFAULTS.phrases[0])

  const commit = () => {
    const a = cleanMascot({ art: draft.current.split('\n'), phrases: [] }).art
    onDone({ ...mascot, art: a.length ? a : [...DEFAULTS.art] })
  }

  return (
    <Modal title="Make your Fluffy" opener={opener} onClose={commit}>
      {close => (
        <>
          <p className="hint">Up to {ART_ROWS} lines of {ART_COLS} plain ASCII characters.</p>
          <div className="mascot-split">
            <div>
              <textarea ref={area} className="mascot-editor" value={text} rows={ART_ROWS} cols={ART_COLS}
                spellCheck="false" autoComplete="off" wrap="off" aria-label="Mascot art"
                onChange={onChange} onSelect={track} onKeyUp={track} onClick={track}
                onKeyDown={e => { if (e.key === 'Enter' && lines.length >= ART_ROWS) e.preventDefault() }} />
              <div className="mascot-count" aria-live="polite">
                line {upto.length}: {upto[upto.length - 1].length}/{ART_COLS} · {lines.length}/{ART_ROWS} lines
              </div>
            </div>
            <pre className="mascot-preview" aria-label="Preview">
              {rows.map((r, i) => (
                <span className="mascot-preview-row" key={i}>
                  <span className="fluffy-monster">{r.monster}</span>{r.bubble}
                </span>
              ))}
            </pre>
          </div>
          <p className="mascot-error" role="alert">{art.length ? '' : 'Empty art flashes Fluffy.'}</p>
          <div className="actions">
            <span className="hint">presets</span>
            {PRESETS.map(p => (
              <button type="button" className="btn" key={p.name} onClick={() => setArt(p.art)}>{p.name}</button>
            ))}
          </div>
          <div className="actions mascot-actions">
            <button type="button" className="btn" onClick={() => setArt(DEFAULTS.art)}>Reset to Fluffy</button>
            <button type="button" className="btn btn-select" onClick={close}>Done</button>
          </div>
        </>
      )}
    </Modal>
  )
}

// Ten rows: the phrases so far (the six defaults to start), then blanks.
export function PhrasesDialog({ mascot, opener, onDone }) {
  const fill = list => Array.from({ length: MAX_PHRASES }, (_, i) => list[i] || '')
  const [rows, setRows] = useState(() => fill(mascot.phrases))
  const draft = useRef(rows)
  draft.current = rows
  const first = useRef(null)
  const pending = useRef(null)

  useLayoutEffect(() => {
    if (!pending.current) return
    const { input, at } = pending.current
    input.setSelectionRange(at, at)
    pending.current = null
  })
  useEffect(() => { first.current.focus() }, [])

  const onChange = (i, e) => {
    const raw = e.target.value
    const v = asciiOnly(raw).slice(0, PHRASE_MAX)
    if (v !== raw) {
      pending.current = {
        input: e.target,
        at: Math.min(asciiOnly(raw.slice(0, e.target.selectionStart)).length, v.length),
      }
    }
    setRows(rows.map((r, j) => (j === i ? v : r)))
  }

  const commit = () => {
    const phrases = cleanMascot({ art: [], phrases: draft.current }).phrases
    onDone({ ...mascot, phrases: phrases.length ? phrases : [...DEFAULTS.phrases] })
  }

  return (
    <Modal title="Phrases" opener={opener} onClose={commit}>
      {close => (
        <>
          <p className="hint">
            What the monster says in its bubble: up to {MAX_PHRASES}, {PHRASE_MAX} plain
            ASCII characters each. Blank rows are skipped.
          </p>
          <p className="mascot-count" aria-live="polite">
            {rows.filter(r => r !== '').length}/{MAX_PHRASES} phrases
          </p>
          <ol className="mascot-phrases">
            {rows.map((r, i) => (
              <li key={i}>
                <input ref={i === 0 ? first : null} type="text" value={r} maxLength={PHRASE_MAX}
                  spellCheck="false" aria-label={`Phrase ${i + 1}`} onChange={e => onChange(i, e)} />
                <span className="mascot-count">{r.length}/{PHRASE_MAX}</span>
              </li>
            ))}
          </ol>
          <div className="actions mascot-actions">
            <button type="button" className="btn" onClick={() => setRows(fill(DEFAULTS.phrases))}>Reset to defaults</button>
            <button type="button" className="btn btn-select" onClick={close}>Done</button>
          </div>
        </>
      )}
    </Modal>
  )
}
