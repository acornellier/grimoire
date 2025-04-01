import { wagoCsvToJson } from '../src/parser/parseTable.ts'

const build = '11.1.0.60037'

let tables = process.argv.slice(2)
if (!tables) throw new Error(`Missing table names`)

if (tables[0] === 'all') {
  tables = [
    'contenttuning',
    'contenttuningxexpected',
    'difficulty',
    'expectedstat',
    'expectedstatmod',
    'spell',
    'spellcasttimes',
    'spelleffect',
    'spellmisc',
    'spellname',
    'spellradius',
    'uimapassignment',
  ]
}

for (const table of tables) {
  console.log(`Fetching ${table}...`)
  // await submoduleCsvToJson(table)
  await wagoCsvToJson(table, build)
}
