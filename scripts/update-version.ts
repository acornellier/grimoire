import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface BuildResponse {
  version: string
}

const response = await fetch('https://wago.tools/api/builds/wow/latest')

if (!response.ok) {
  throw new Error(`Failed to fetch builds: ${response.status} ${response.statusText}`)
}

const json = (await response.json()) as BuildResponse
const version = json.version
console.log(`Latest retail WoW build: ${version}`)

const root = resolve(import.meta.dirname, '..')

// Update scripts/table.ts
const tablePath = resolve(root, 'scripts/table.ts')
const tableContent = readFileSync(tablePath, 'utf-8')
const updatedTable = tableContent.replace(
  /^(const build = ')[^']+(')/m,
  `$1${version}$2`,
)
writeFileSync(tablePath, updatedTable)

// Update package.json
// version format: 12.0.1.66527 → 12.0.1-66527 (replace last dot with dash)
const pkgVersion = version.replace(/\.(\d+)$/, '-$1')
const pkgPath = resolve(root, 'package.json')
const pkgContent = readFileSync(pkgPath, 'utf-8')
const updatedPkg = pkgContent.replace(/"version": "[^"]+"/, `"version": "${pkgVersion}"`)
writeFileSync(pkgPath, updatedPkg)
