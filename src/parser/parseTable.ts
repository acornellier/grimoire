import { getDirname } from '../files.ts'
import { parseCsvFile } from './parseCsv.ts'
import fs from 'fs/promises'

const dirname = getDirname(import.meta.url)

export async function getWagoTable(table: string) {
  const data = await parseCsvFile(`${dirname}/../../wow-dbc-archive/${table}.csv`, {
    columns: true,
  })

  await fs.writeFile(`${dirname}/../dbcJson/${table}.json`, JSON.stringify(data), 'utf-8')
}
