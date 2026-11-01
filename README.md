# monster-cyberspace-web

Information site and browser-based firmware flasher for
[Monster for Cyberspace](https://github.com/oumike/monster-cyberspace), a
standalone [cyberspace.online](https://cyberspace.online) client for handheld
ESP32 devices.

The page is drawn the way the device draws itself: Terminus throughout,
status-bar section headings, a live 40×15 room, and all 17 firmware themes
(pick one and the page re-themes). The flasher uses
[esp-web-tools](https://esphome.github.io/esp-web-tools/) to write a release
image over USB from the browser.

By the flasher, **Make your Fluffy** draws or picks the boot-screen mascot
(up to 13×6 plain ASCII characters) and **Phrases** sets up to ten things it
says (80 characters each). The browser keeps both. When either differs from
the default, Flash also writes a 4 KB mascot blob at `0xcb0000`, made by
`src/mascot.mjs` (a copy of the firmware repo's `site/mascot.mjs`; presets in
`src/mascots.json`). It needs firmware newer than v0.1.8; older firmware
ignores it. Boards built without the mascot partition (`NO_MASCOT_BOARDS`
in `src/mascot.mjs`: the Cardputer ADV) hide both buttons.

Live at <https://monster.sumat.org/>.

## Develop

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

## Build

```bash
npm test            # mascot encoder against the firmware repo's golden bytes
npm run build       # outputs static files to dist/
npm run preview     # serves the built site on :4173
```

## Run as a container

Releases publish an image to GHCR for `linux/amd64` and `linux/arm64`:

```bash
docker run --rm -p 10082:80 ghcr.io/oumike/monster-cyberspace-web:latest
```

The published image is **baked for the `/monster/` subpath**: asset URLs point
at `/monster/assets/…`. nginx in the image serves the page at `/` as well and
maps `/monster/…` back onto the site root, so a proxy can forward a whole
hostname to it.

On the server, with the repo checked out at `~/Projects/monster-cyberspace-web`:

```bash
./update-container.sh                 # pull :latest and recreate
./update-container.sh --tag 1.0.1     # roll back to an exact version
```

`--git-pull` refreshes the checkout first, which is only needed when
`docker-compose.yml` or the script itself has changed.

### Building it yourself

`docker-compose.yml` is pull-only. Local builds use an overlay that tags the
result `monster-cyberspace-web:local`:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

> `nginx.conf` is baked into the image. Editing it on the server has no
> effect; an nginx change needs a commit and a release.

### Reverse proxy

On donut, nginx-proxy-manager forwards `monster.sumat.org` to
`http://donut:10082` with SSL. The in-browser flasher uses Web Serial, which
only runs on HTTPS (or `localhost`) in Chromium-based desktop browsers; other
browsers get the `.bin` download instead.

### Firmware downloads

GitHub release assets carry no CORS headers, so the flasher fetches them
through the container: `/firmware/<tag>/<file>` is proxied by nginx (and by
Vite in development) to
`github.com/oumike/monster-cyberspace/releases/download/<tag>/<file>`.

## Releasing

Releases are cut by hand from the Actions tab, never on a push or a tag.

1. **Actions → Release → Run workflow**, from `main`.
2. Leave `version` blank to bump the patch of the latest tag, or type an exact
   `X.Y.Z`. The first release seeds `1.0.0`.
3. Tick `dry_run` to build and smoke-test without publishing anything.

The job syncs `FIRMWARE_VERSION` in `src/firmware.js` from the latest
monster-cyberspace release, bumps `package.json`, builds and smoke-tests the
image, then pushes the image, the commit, the tag and the GitHub Release.
`:latest` moves last. Then, on the server:

```bash
./update-container.sh
```

### One-time setup

The first release creates `ghcr.io/oumike/monster-cyberspace-web` as a
**private** package, and `docker compose pull` fails with a 401. After the
first release, in the package settings: **Change visibility → Public**.

## Credits

Set in [Terminus](public/fonts/OFL-Terminus.txt) (SIL Open Font License 1.1).
Theme colours are cyberspace.online's, as listed in
[cyberspace-atmospheric-modulator](https://github.com/z0mbieparade/cyberspace-atmospheric-modulator).
Fluffy, the mascot, is the boot-screen monster from the firmware's
`lib/core/src/ui/splash_layout.cpp`. The footer draws him as the device does
(his art, speech bubble and words); the favicon redraws him as 16×16 pixels.

Licensed under the GPL-3.0.
