import { getDirname } from '../util/files.ts'
import { parseCsvFile } from './parseCsv.ts'
import fs from 'fs/promises'
import path from 'path'

const dirname = getDirname(import.meta.url)

export async function getWagoTable(table: string) {
  const data = await parseCsvFile(`${dirname}/../../wow-dbc-archive/${table}.csv`, {
    columns: true,
  })

  const destinationPath = `${dirname}/../dbcJson/${table}.json`

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  await fs.writeFile(destinationPath, JSON.stringify(data), 'utf-8')
}
