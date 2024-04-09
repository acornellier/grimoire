import { getWagoTable } from '../src/parser/parseTable.ts'

const tables = process.argv.slice(2)
if (!tables) throw new Error(`Missing table names`)

for (const table of tables) {
  await getWagoTable(table)
}
