// The line under Flash. Counts from blobMascot, the same lists the encoder
// writes, so the number is what goes onto the board: every non-empty slot.
import { blobMascot } from './mascot.mjs'

export function mascotStatus(m, defaults) {
  const b = blobMascot(m, defaults)
  const n = b.phrases.length
  const words = `${n} phrase${n === 1 ? '' : 's'}`
  if (!b.art.length && !n) return 'Flashes with Fluffy and his phrases.'
  if (!n) return "Flashes with your mascot and Fluffy's phrases."
  if (!b.art.length) return `Flashes with Fluffy and your ${words}.`
  return `Flashes with your mascot and ${words}.`
}
