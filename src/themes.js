// The firmware's seventeen themes, in its Settings order, with the colours
// from monster-cyberspace's lib/core/src/ui/theme.cpp. The page wears whichever
// one is picked, through the CSS custom properties applyTheme() sets.

// Default, Black & white and White & black are the firmware's own and set
// every colour. The rest go through site() there: one ink for the bar text,
// times, system lines and your own nick (dim), and fg on bg for selections.
function site(id, label, bg, fg, dim, bar, panel, mention, error, nickL = null) {
  return {
    id, label, bg, fg, dim, sys: dim, time: dim, self: dim,
    bar, barFg: fg, panel, input: panel, mention,
    select: fg, selectFg: bg, edge: dim, error,
    colorNicks: nickL !== null, nickL: nickL ?? 68, nick: fg,
  }
}

export const THEMES = [
  {
    id: 'default', label: 'Default',
    bg: '#000000', fg: '#B8C0CC', dim: '#555555', sys: '#6C7A89', time: '#5B9BFF', self: '#FFD166',
    bar: '#1B2A1B', barFg: '#7CFC7C', panel: '#141414', input: '#0D0D0D', mention: '#22223A',
    select: '#7CFC7C', selectFg: '#000000', edge: '#7CFC7C', error: '#FF5555',
    colorNicks: true, nickL: 68, nick: '#B8C0CC',
  },
  {
    id: 'bw', label: 'Black & white',
    bg: '#000000', fg: '#FFFFFF', dim: '#808080', sys: '#909090', time: '#A0A0A0', self: '#FFFFFF',
    bar: '#303030', barFg: '#FFFFFF', panel: '#181818', input: '#101010', mention: '#383838',
    select: '#FFFFFF', selectFg: '#000000', edge: '#FFFFFF', error: '#FFFFFF',
    colorNicks: false, nickL: 68, nick: '#C8C8C8',
  },
  {
    id: 'wb', label: 'White & black',
    bg: '#FFFFFF', fg: '#000000', dim: '#707070', sys: '#606060', time: '#505050', self: '#000000',
    bar: '#D0D0D0', barFg: '#000000', panel: '#E8E8E8', input: '#F0F0F0', mention: '#D8D8D8',
    select: '#000000', selectFg: '#FFFFFF', edge: '#000000', error: '#000000',
    colorNicks: false, nickL: 68, nick: '#383838',
  },
  site('dark', 'Dark', '#000000', '#EFE5C0', '#A89984', '#3A3A3A', '#121212', '#232323', '#FF5555'),
  site('light', 'Light', '#EFE5C0', '#000000', '#3A3A3A', '#A89984', '#DCD3B1', '#C4B79C', '#C01818'),
  site('lcd', 'LCD', '#EAEAE4', '#000000', '#3A3A3A', '#9AA49D', '#B4C2AA', '#BAC0B9', '#C01818'),
  site('c64', 'C64', '#2A2AB8', '#CACAED', '#7F7FD4', '#6A6ACD', '#3B3BBE', '#5050C5', '#FF5555'),
  site('vt320', 'VT320', '#170800', '#FF9A10', '#FF9100', '#563000', '#230F00', '#3D2000', '#FF5555'),
  site('matrix', 'Matrix', '#000000', '#90CA3D', '#507022', '#405A1B', '#001405', '#263610', '#FF5555'),
  site('poetry', 'Poetry', '#FEFAF8', '#222222', '#666666', '#CCCCCC', '#F0E0DD', '#E0DEDE', '#C01818'),
  site('brutalist', 'Brutalist', '#080810', '#C0D0E8', '#99A9BF', '#232735', '#11121C', '#181B26', '#FF5555'),
  site('grid', 'GRiD', '#180F06', '#FEA813', '#D08C17', '#49310B', '#2A1B08', '#352309', '#FF5555'),
  site('crypt', 'Crypt', '#100202', '#EE1100', '#CF0000', '#580101', '#1C0202', '#3B0101', '#FFFFFF'),
  site('bubblegum', 'Bubblegum', '#FFE4F1', '#6B1A4A', '#B86B93', '#F5B5D1', '#FFD0E5', '#F9C8DE', '#C01818', 32),
  site('top8', 'Top8', '#FFFFFF', '#000000', '#666666', '#6699CC', '#E6F2FF', '#A3C2E0', '#C01818', 32),
  site('bubblegumdark', 'Bubblegum Dark', '#2A0F1F', '#FFD0E5', '#C97FA6', '#6B1A4A', '#3A1529', '#4F1F3A', '#FF5555', 74),
  site('top8dark', 'Top8 Dark', '#0B1622', '#E6F2FF', '#8FA8C2', '#336699', '#13243A', '#1F3A5C', '#FF5555', 74),
]

export function themeById(id) {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

// Perceived lightness of the background, so the browser's own widgets
// (scrollbars, the select popup) follow the theme.
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140
}

const VARS = ['bg', 'fg', 'dim', 'sys', 'time', 'self', 'bar', 'barFg', 'panel', 'input',
  'mention', 'select', 'selectFg', 'edge', 'error']

export function applyTheme(el, theme) {
  for (const k of VARS) {
    el.style.setProperty(`--${k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}`, theme[k])
  }
  el.style.colorScheme = isLight(theme.bg) ? 'light' : 'dark'
  el.dataset.theme = theme.id
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.bar)
}

// The website's nick colour, as the firmware draws it (ui/nick_color.cpp):
// hue = FNV-1a (32-bit) of the lower-cased name mod 360, saturation 70%, and
// the theme's lightness. Your own nick is always the theme's self colour.
function fnv1a32Lower(name) {
  let h = 0x811c9dc5
  for (const ch of name.toLowerCase()) {
    h ^= ch.charCodeAt(0) & 0xff
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

export const SELF = 'oumike'

export function nickColor(theme, name) {
  if (name === SELF) return theme.self
  if (!theme.colorNicks) return theme.nick
  return `hsl(${fnv1a32Lower(name) % 360} 70% ${theme.nickL}%)`
}
