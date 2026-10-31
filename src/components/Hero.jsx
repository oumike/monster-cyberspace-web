import RoomSim from './RoomSim.jsx'

export default function Hero({ theme, canFlash }) {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Monster for Cyberspace</h1>
        <p className="lede">
          Firmware that turns a handheld ESP32 device into a client
          for <a href="https://cyberspace.online">cyberspace.online</a>, the
          text-only social network. Chat in the rooms, read and answer C-Mail,
          follow the Feed and your guilds on the device's own screen and keys.
        </p>
        <div className="actions">
          {canFlash
            ? <a className="btn btn-select" href="#install">Install from the browser</a>
            : <a className="btn btn-select" href="https://github.com/oumike/monster-cyberspace/releases/latest">Download a release</a>}
          <a className="btn" href="https://github.com/oumike/monster-cyberspace/blob/main/docs/USE.md">Read the guide</a>
        </div>
      </div>
      <RoomSim theme={theme} />
    </section>
  )
}
