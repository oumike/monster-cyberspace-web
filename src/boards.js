import { withBase } from './basePath'

// One entry per release image. `slug` is the image's name in the release
// (board::otaSlug() in each HAL). Device photos are camillia-mt-web's;
// no-photo.svg (its stand-in artwork) marks a board with no photo yet.
// `note`: what a board's build leaves out; `ota: false`: no over-the-air updates.
export const BOARDS = [
  { slug: 'm9', name: 'Elecrow ThinkNode M9', input: 'Keyboard and d-pad', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'm9.jpg' },
  { slug: 'mesh-deck', name: 'Attaky Mesh Deck', input: 'Keyboard, d-pad and touch', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'mesh-deck.jpg' },
  { slug: 'cyber-deck-plus', name: 'Attaky Cyber Deck Plus', input: 'Keyboard, d-pad, gamepad and touch', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'cyber-deck-plus.jpg' },
  { slug: 'tdeck', name: 'LilyGO T-Deck Plus', input: 'Keyboard, trackball and touch', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'tdeck.png' },
  { slug: 'tdeck-pro', name: 'LilyGO T-Deck Pro', input: 'Keyboard and touch', screen: 'E-paper', chip: 'ESP32-S3', image: 'tdeck-pro.jpg' },
  { slug: 'pager', name: 'LilyGO T-LoRa Pager', input: 'Keyboard and side wheel', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'tlora-pager-tft.png' },
  { slug: 'wio-l2', name: 'Seeed Wio Tracker L2', input: 'Touch', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'wio-tracker-l2.jpg' },
  { slug: 'crowpanel35', name: 'Elecrow CrowPanel Advance 3.5"', input: 'Touch', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'crowpanel-35.jpg' },
  { slug: 'crowpanel50', name: 'Elecrow CrowPanel Advance 5.0"', input: 'Touch', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'crowpanel-50.jpg' },
  { slug: 'cardputer-adv', name: 'M5Stack Cardputer ADV', input: 'Keyboard', screen: 'Colour LCD', chip: 'ESP32-S3', image: 'cardputer-adv.png', ota: false, note: 'No Guilds, spell check, emoji tray, over-the-air updates or custom mascot' },
  { slug: 'x4', name: 'Xteink X4', input: 'Six buttons', screen: 'E-paper', chip: 'ESP32-C3', image: 'no-photo.svg' },
].map(b => ({ ...b, image: b.image && withBase(`/devices/${b.image}`) }))
