import { execSync } from 'child_process'
import { resolve } from 'path'

// usage: yarn release [version|channel] [--skip-data]
//   yarn release                 latest live build
//   yarn release ptr             latest ptr build
//   yarn release 12.1.0.69189    that exact build
//   yarn release --skip-data     reuse existing data (skips update-version and parse)
const args = process.argv.slice(2)
const skipData = args.includes('--skip-data')
const arg = args.find((a) => !a.startsWith('--'))

if (arg && !/^[\w.]+$/.test(arg)) throw new Error(`Invalid version/channel '${arg}'`)

const steps: [string, string][] = [
  ...(skipData
    ? []
    : ([
        ['update-version', `yarn update-version${arg ? ` ${arg}` : ''}`],
        ['parse', 'yarn parse'],
      ] as [string, string][])),
  ['convert', 'yarn convert'],
  ['build', 'yarn build'],
  ['publish', 'npm publish --tag latest'],
]

// yarn leaks npm_config_* into child processes (including
// npm_config_registry=https://registry.yarnpkg.com), which breaks npm publish auth
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith('npm_config_')),
)

const root = resolve(import.meta.dirname, '..')

for (const [name, command] of steps) {
  console.log(`\n=== ${name}: ${command}\n`)
  execSync(command, { cwd: root, stdio: 'inherit', env })
}
