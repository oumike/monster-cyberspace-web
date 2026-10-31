import Bar from './Bar.jsx'

// A real sequence, so it is numbered (docs/USE.md, "First setup").
export default function Setup() {
  return (
    <section className="section" aria-labelledby="setup">
      <Bar id="setup" title="first setup" />
      <ol className="steps">
        <li>
          Power it on. With no Wi-Fi saved it starts its own network,
          named <code>Monster-Cyberspace-M9-Setup</code> or similar for your
          board, and shows the name on screen.
        </li>
        <li>
          Join that network from a phone or laptop and
          open <code>http://192.168.4.1</code>. Nothing pops up by itself;
          type the address.
        </li>
        <li>
          Under Wi-Fi, pick your network, enter its password, check the time
          zone and save. The device restarts and joins it.
        </li>
        <li>
          On your own network, open <code>http://monster-cyberspace.local</code> and
          sign in to Cyberspace. The device keeps a sign-in token and forgets
          the password.
        </li>
      </ol>
      <p className="intro">
        No browser handy? The setup screen can also join Wi-Fi and sign in on
        the device itself.
      </p>
    </section>
  )
}
