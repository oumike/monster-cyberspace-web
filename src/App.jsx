import { useEffect, useState } from 'react'
import { THEMES, themeById, applyTheme } from './themes.js'
import { releaseCatalog } from './firmware.js'
import { CAN_FLASH } from './platform.js'
import TopBar from './components/TopBar.jsx'
import Hero from './components/Hero.jsx'
import Screens from './components/Screens.jsx'
import Themes from './components/Themes.jsx'
import Boards from './components/Boards.jsx'
import Install from './components/Install.jsx'
import Setup from './components/Setup.jsx'
import Docs from './components/Docs.jsx'
import Footer from './components/Footer.jsx'

const STORAGE_KEY = 'monster-theme'

function loadTheme() {
  try {
    const id = localStorage.getItem(STORAGE_KEY)
    if (THEMES.some(t => t.id === id)) return id
  } catch {}
  return 'default'
}

export default function App() {
  const [themeId, setThemeId] = useState(loadTheme)
  const theme = themeById(themeId)
  // null while loading; { failed: true } when GitHub can't be reached.
  const [catalog, setCatalog] = useState(null)

  useEffect(() => {
    applyTheme(document.documentElement, theme)
    try { localStorage.setItem(STORAGE_KEY, theme.id) } catch {}
  }, [theme])

  useEffect(() => {
    let cancelled = false
    releaseCatalog()
      .then(items => { if (!cancelled) setCatalog({ items }) })
      .catch(() => { if (!cancelled) setCatalog({ items: null, failed: true }) })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar theme={theme} onTheme={setThemeId} canFlash={CAN_FLASH} />
      <main id="main">
        <Hero theme={theme} canFlash={CAN_FLASH} />
        <Screens />
        <Themes current={theme.id} onTheme={setThemeId} />
        <Boards catalog={catalog} />
        {CAN_FLASH && <Install catalog={catalog} />}
        <Setup />
        <Docs />
      </main>
      <Footer />
    </>
  )
}
