import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface BuildResponse {
  version: string
}

// wago.tools product per release channel
const products: Record<string, string> = {
  live: 'wow',
  retail: 'wow',
  ptr: 'wowt',
  xptr: 'wowxptr',
  beta: 'wow_beta',
  classic: 'wow_classic',
}

const isVersion = (arg: string) => /^\d+(\.\d+){3}$/.test(arg)

async function fetchLatestVersion(channel: string) {
  const product = products[channel.toLowerCase()]
  if (!product)
    throw new Error(
      `Unknown channel '${channel}'. Pass a build version (12.1.0.69189) or one of: ${Object.keys(products).join(', ')}`,
    )

  const response = await fetch(`https://wago.tools/api/builds/${product}/latest`)

  if (!response.ok) {
    throw new Error(`Failed to fetch builds: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as BuildResponse
  console.log(`Latest ${product} build: ${json.version}`)
  return json.version
}

// arg is either an explicit build version or a channel name, defaulting to live
const arg = process.argv[2] ?? 'live'
const version = isVersion(arg) ? arg : await fetchLatestVersion(arg)
console.log(`Setting version to ${version}`)

const root = resolve(import.meta.dirname, '..')

// Update scripts/table.ts
const tablePath = resolve(root, 'scripts/table.ts')
const tableContent = readFileSync(tablePath, 'utf-8')
const updatedTable = tableContent.replace(/^(const build = ')[^']+(')/m, `$1${version}$2`)
writeFileSync(tablePath, updatedTable)

// Update package.json
// version format: 12.0.1.66527 → 12.0.1-66527 (replace last dot with dash)
const pkgVersion = version.replace(/\.(\d+)$/, '-$1')
const pkgPath = resolve(root, 'package.json')
const pkgContent = readFileSync(pkgPath, 'utf-8')
const updatedPkg = pkgContent.replace(/"version": "[^"]+"/, `"version": "${pkgVersion}"`)
writeFileSync(pkgPath, updatedPkg)
