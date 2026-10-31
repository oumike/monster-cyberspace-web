import { useEffect, useState } from 'react'
import { withBase } from '../basePath'

const REPO = 'oumike/monster-cyberspace'

// Buy Me a Coffee's real button, rendered the way camillia-mt-web does it.
// The script's own path ends in document.writeln(), which is useless once the
// page has parsed; loaded without its data-name tag it only defines
// window.bmcBtnWidget, which we call ourselves.
const BMC_SCRIPT = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'
const BMC_URL = 'https://buymeacoffee.com/oumike'
const BMC = {
  text: 'Buy me a book.',
  slug: 'oumike',
  color: '#FFDD00',
  emoji: '\u{1F4D6}',
  font: 'Cookie',
  fontColor: '#000000',
  outlineColor: '#000000',
  coffeeColor: '#ffffff',
}

function BuyMeACoffee() {
  const [markup, setMarkup] = useState(null)

  useEffect(() => {
    let cancelled = false
    const render = () => {
      if (cancelled || typeof window.bmcBtnWidget !== 'function') return
      setMarkup(window.bmcBtnWidget(
        BMC.text, BMC.slug, BMC.color, BMC.emoji, BMC.font,
        BMC.fontColor, BMC.outlineColor, BMC.coffeeColor,
      ))
    }
    if (typeof window.bmcBtnWidget === 'function') {
      render()
      return () => { cancelled = true }
    }
    let script = document.querySelector(`script[src="${BMC_SCRIPT}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = BMC_SCRIPT
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener('load', render)
    return () => {
      cancelled = true
      script.removeEventListener('load', render)
    }
  }, [])

  // Until the script arrives, or if it never does, the plain link still works.
  return markup ? (
    <div className="footer-bmc" dangerouslySetInnerHTML={{ __html: markup }} />
  ) : (
    <a className="footer-bmc-link" href={BMC_URL} target="_blank" rel="noreferrer">
      {BMC.text}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-row">
        <p className="footer-mark">Monster for Cyberspace, GPLv3</p>
        <p className="footer-links">
          <a href={`https://github.com/${REPO}`} target="_blank" rel="noreferrer">Source</a>
          <a href={`https://github.com/${REPO}/releases`} target="_blank" rel="noreferrer">Releases</a>
          <a href={`https://github.com/${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">License</a>
        </p>
        <BuyMeACoffee />
      </div>
      <p>
        Not affiliated with cyberspace.online, which has its own terms.
        Set in <a href={withBase('/fonts/OFL-Terminus.txt')}>Terminus</a>, the
        font the firmware draws with (SIL Open Font License 1.1). Theme colours
        are cyberspace.online's, as listed
        in <a href="https://github.com/z0mbieparade/cyberspace-atmospheric-modulator">cyberspace-atmospheric-modulator</a>.
      </p>
    </footer>
  )
}
