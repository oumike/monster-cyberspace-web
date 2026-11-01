import { useEffect, useMemo, useRef, useState } from 'react'
import 'esp-web-tools'
import Bar from './Bar.jsx'
import { BOARDS } from '../boards.js'
import { versionsFor, manifestDataUrl, firmwareUrl, releaseUrl, FIRMWARE_VERSION } from '../firmware.js'
import { MASCOT_OFFSET, blobMascot, encodeMascot, hasMascot, isDefault } from '../mascot.mjs'
import { ArtDialog, PhrasesDialog, DEFAULTS, loadMascot, saveMascot, mascotStatus } from './Mascot.jsx'

export default function Install({ catalog }) {
  const [slug, setSlug] = useState(BOARDS[0].slug)
  const [version, setVersion] = useState(null)
  const [serial, setSerial] = useState(true)
  useEffect(() => setSerial('serial' in navigator), [])

  const board = BOARDS.find(b => b.slug === slug) ?? BOARDS[0]
  const mascotOk = hasMascot(slug)
  const ota = board.ota !== false
  const failed = !!catalog?.failed
  const versions = useMemo(
    () => (catalog ? versionsFor(catalog.items, slug, failed) : []),
    [catalog, slug, failed]
  )
  useEffect(() => {
    if (!versions.includes(version)) setVersion(versions[0] ?? null)
  }, [versions, version])

  const [mascot, setMascot] = useState(loadMascot)
  const [dialog, setDialog] = useState(null)
  const artBtn = useRef(null)
  const phrasesBtn = useRef(null)
  const onDone = m => {
    setMascot(m)
    saveMascot(m)
    setDialog(null)
  }

  // A changed mascot or phrases goes on as a second part, the blob at
  // MASCOT_OFFSET; with the defaults, only the firmware is written.
  const [blobUrl, setBlobUrl] = useState(null)
  useEffect(() => {
    if (isDefault(mascot, DEFAULTS)) {
      setBlobUrl(null)
      return
    }
    const bytes = encodeMascot(blobMascot(mascot, DEFAULTS))
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }))
    setBlobUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [mascot])

  const latest = catalog?.items?.find(r => !r.prerelease)?.tag ?? (failed ? FIRMWARE_VERSION : null)
  const manifest = useMemo(
    () => (version
      ? manifestDataUrl(board, version, blobUrl && mascotOk ? [{ path: blobUrl, offset: MASCOT_OFFSET }] : [])
      : null),
    [board, version, blobUrl, mascotOk]
  )

  return (
    <section className="section" aria-labelledby="install">
      <Bar id="install" title="install">{latest}</Bar>
      <p className="intro">
        Plug the board in over USB, pick it here and press Flash. This page
        writes the image straight to it from Chrome or Edge on a desktop.
      </p>
      {!serial && (
        <p className="notice">
          This browser can't talk to USB serial ports. Open the page in Chrome
          or Edge on a desktop, or download the image and flash it
          with <code>flash.sh</code>.
        </p>
      )}
      <div className="install">
        <div className="fields">
          <label className="field">
            <span className="field-label">board</span>
            <select value={slug} onChange={e => setSlug(e.target.value)}>
              {BOARDS.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">version</span>
            <select value={version ?? ''} onChange={e => setVersion(e.target.value)} disabled={!versions.length}>
              {versions.map(v => <option key={v} value={v}>{v}</option>)}
              {!versions.length && <option value="">{catalog ? 'none for this board' : 'loading…'}</option>}
            </select>
          </label>
        </div>
        <div className="actions flash-row">
          {manifest ? (
            <esp-web-install-button key={`${slug}-${version}`} manifest={manifest}>
              <button slot="activate" className="btn btn-select">Flash {version}</button>
              <span slot="unsupported" className="notice">Flashing needs Chrome or Edge on a desktop.</span>
              <span slot="not-allowed" className="notice">Flashing needs this page over https.</span>
            </esp-web-install-button>
          ) : (
            <button type="button" className="btn btn-select" disabled>
              {catalog ? 'No release for this board yet' : 'Loading releases…'}
            </button>
          )}
          {mascotOk && (
            <>
              <button type="button" className="btn" ref={artBtn} onClick={() => setDialog('art')}>Make your Fluffy</button>
              <button type="button" className="btn" ref={phrasesBtn} onClick={() => setDialog('phrases')}>Phrases</button>
            </>
          )}
        </div>
        <p className="hint mascot-status" aria-live="polite">
          {mascotOk ? mascotStatus(mascot) : `${board.name} always shows Fluffy and his words.`}
        </p>
        {version && (
          <div className="actions">
            <a className="btn" href={firmwareUrl(slug, version)} download>Download .bin</a>
            <a className="btn" href={releaseUrl(version)}>Release notes</a>
          </div>
        )}
        {mascotOk && dialog === 'art' && <ArtDialog mascot={mascot} opener={artBtn} onDone={onDone} />}
        {mascotOk && dialog === 'phrases' && <PhrasesDialog mascot={mascot} opener={phrasesBtn} onDone={onDone} />}
        {failed && (
          <p className="hint">
            GitHub's release list didn't load, so only {FIRMWARE_VERSION} is offered.
          </p>
        )}
        <ul className="hints">
          <li>The installer asks whether to erase. Erasing clears saved Wi-Fi, sign-in and settings; without it they're kept.</li>
          <li>Your own mascot and phrases need firmware newer than v0.1.8; older firmware shows Fluffy and his words. Over-the-air updates keep them.</li>
          {ota
            ? <li>After this, updates come over the air: Settings &rsaquo; Firmware on the device, or web config.</li>
            : <li>{board.name} has no over-the-air updates: flash a new release from this page; without erasing, settings are kept.</li>}
          <li>From a terminal instead: <code>./flash.sh monster-cyberspace-{slug}-{version ?? '<tag>'}.bin /dev/ttyUSB0</code>, with <code>flash.sh</code> from the same release.</li>
        </ul>
      </div>
    </section>
  )
}
