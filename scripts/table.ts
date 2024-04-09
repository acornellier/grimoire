import { getWagoTable } from '../src/parser/parseTable.ts'

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
    'spelleffect',
    'spellmisc',
    'spellname',
  ]
}

for (const table of tables) {
  console.log(`Fetching ${table}...`)
  await getWagoTable(table)
}
