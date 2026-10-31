import { withBase } from './basePath'

// The firmware's demo build on the Attaky Mesh Deck, Default theme: made-up
// users and messages (monster-cyberspace docs/BUILD.md, "Screenshots").
export const SCREENS = [
  ['home', 'Home', 'Where every board starts. Tiles for chat, rooms, C-Mail, the Feed and settings.'],
  ['rooms', 'Rooms', 'Every cIRC room, with how many people are online in each.'],
  ['room', 'A room', 'The live chat log. Nicks keep the colours the website gives them.'],
  ['typing', 'Typing', 'The input line under the log. A line that mentions you is highlighted.'],
  ['symbols', 'Symbol table', 'Punctuation a small keyboard lacks, a key press away.'],
  ['emoji', 'Emoji tray', 'Forty emoji, picked with the d-pad or a tap.'],
  ['palette', 'Command palette', 'Slash commands: /me, /poke, /dice, /8ball, /spoiler and the rest.'],
  ['cmail', 'C-Mail', 'Private conversations, unread ones marked.'],
  ['conversation', 'A conversation', 'One C-Mail thread, split by day.'],
  ['feed', 'Feed', 'Entries with their age and reply count. Content warnings stay folded.'],
  ['post', 'A post and replies', 'An entry with its replies under it.'],
  ['settings', 'Settings', 'Theme, text size, time zone, Wi-Fi, firmware updates.'],
  ['themes', 'Themes', 'The theme picker. This page can wear any of them.'],
].map(([id, title, caption]) => ({ id, title, caption, src: withBase(`/screens/${id}.png`) }))
