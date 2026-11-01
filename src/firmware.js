import { withBase } from './basePath'

// FIRMWARE_VERSION is only the fallback for when the GitHub API call fails
// (rate limit, offline); the version list is fetched at page load by
// releaseCatalog(). The release workflow syncs this line, so keep its shape.
export const FIRMWARE_VERSION = 'v0.1.8'
export const REPO = 'oumike/monster-cyberspace'

// Same-origin proxy path. Vite (dev) and nginx (prod) forward
// /firmware/<tag>/<file> to github.com/<repo>/releases/download/<tag>/<file>,
// adding the CORS header esp-web-tools' fetch() needs.
export const PROXY_BASE = withBase('/firmware')

// scripts/release.sh's env_out_name slug, as in monster-cyberspace-<slug>-<tag>.bin.
export function assetName(slug, tag) {
  return `monster-cyberspace-${slug}-${tag}.bin`
}

export function firmwareUrl(slug, tag) {
  return `${PROXY_BASE}/${tag}/${assetName(slug, tag)}`
}

export function releaseUrl(tag) {
  return `https://github.com/${REPO}/releases/tag/${encodeURIComponent(tag)}`
}

// release.sh writes one merged image flashed at 0x0, the same as the
// monster-cyberspace Pages flasher (scripts/pages-site.sh). The part URL must
// be absolute: esp-web-tools calls `new URL(path)` without a base. `extra` are
// more parts, such as the mascot blob (a blob: URL, already absolute).
export function manifestDataUrl(board, tag, extra = []) {
  const manifest = {
    name: `Monster for Cyberspace (${board.name})`,
    version: tag,
    new_install_prompt_erase: true,
    builds: [{
      chipFamily: board.chip,
      parts: [{ path: `${window.location.origin}${firmwareUrl(board.slug, tag)}`, offset: 0 }, ...extra],
    }],
  }
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest))}`
}

// Every non-draft release, newest first: [{ tag, assetNames, url, prerelease }].
export async function releaseCatalog() {
  const out = []
  for (let page = 1; page <= 10; page += 1) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`,
      { headers: { Accept: 'application/vnd.github+json' } }
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('Unexpected releases response')
    for (const rel of data) {
      if (!rel || rel.draft || !rel.tag_name) continue
      out.push({
        tag: rel.tag_name,
        assetNames: (rel.assets ?? []).map(a => a?.name).filter(Boolean),
        url: rel.html_url ?? '',
        prerelease: !!rel.prerelease,
      })
    }
    if (data.length < 100) break
  }
  return out
}

// Stable tags with an image for this board, newest first. When the API is
// unreachable (catalog null after a failure) the fallback stands in.
export function versionsFor(catalog, slug, failed) {
  if (failed) return [FIRMWARE_VERSION]
  if (!catalog) return []
  return catalog
    .filter(r => !r.prerelease && r.assetNames.includes(assetName(slug, r.tag)))
    .map(r => r.tag)
}
