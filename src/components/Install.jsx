import { useEffect, useMemo, useState } from 'react'
import 'esp-web-tools'
import Bar from './Bar.jsx'
import { BOARDS } from '../boards.js'
import { versionsFor, manifestDataUrl, firmwareUrl, releaseUrl, FIRMWARE_VERSION } from '../firmware.js'

export default function Install({ catalog }) {
  const [slug, setSlug] = useState(BOARDS[0].slug)
  const [version, setVersion] = useState(null)
  const [serial, setSerial] = useState(true)
  useEffect(() => setSerial('serial' in navigator), [])

  const board = BOARDS.find(b => b.slug === slug) ?? BOARDS[0]
  const failed = !!catalog?.failed
  const versions = useMemo(
    () => (catalog ? versionsFor(catalog.items, slug, failed) : []),
    [catalog, slug, failed]
  )
  useEffect(() => {
    if (!versions.includes(version)) setVersion(versions[0] ?? null)
  }, [versions, version])

  const latest = catalog?.items?.find(r => !r.prerelease)?.tag ?? (failed ? FIRMWARE_VERSION : null)
  const manifest = useMemo(
    () => (version ? manifestDataUrl(board, version) : null),
    [board, version]
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
        <div className="actions">
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
          {version && <a className="btn" href={firmwareUrl(slug, version)} download>Download .bin</a>}
          {version && <a className="btn" href={releaseUrl(version)}>Release notes</a>}
        </div>
        {failed && (
          <p className="hint">
            GitHub's release list didn't load, so only {FIRMWARE_VERSION} is offered.
          </p>
        )}
        <ul className="hints">
          <li>The installer asks whether to erase. Erasing clears saved Wi-Fi, sign-in and settings; without it they're kept.</li>
          <li>After this, updates come over the air: Settings &rsaquo; Firmware on the device, or web config.</li>
          <li>From a terminal instead: <code>./flash.sh monster-cyberspace-{slug}-{version ?? '<tag>'}.bin /dev/ttyUSB0</code>, with <code>flash.sh</code> from the same release.</li>
        </ul>
      </div>
    </section>
  )
}
