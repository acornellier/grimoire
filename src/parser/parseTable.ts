import { getDirname } from '../util/files.ts'
import { parseCsvContents, parseCsvFile } from './parseCsv.ts'
import fs from 'fs/promises'
import path from 'path'

const dirname = getDirname(import.meta.url)

export async function submoduleCsvToJson(table: string) {
  const data = await parseCsvFile(`${dirname}/../../wow-dbc-archive/${table}.csv`, {
    columns: true,
  })

  await saveJsonFile(table, data)
}

export async function wagoCsvToJson(table: string, build: string) {
  const url = `https://wago.tools/db2/${table}/csv?build=${build}`

  const response = await fetch(url)

  if (!response.body) {
    throw new Error(`No response body for url ${url}`)
  }

  const buffer = await response.arrayBuffer()
  const array = new Uint8Array(buffer)

  const data = await parseCsvContents(array, {
    columns: true,
  })

  await saveJsonFile(table, data)
}

export async function saveJsonFile(table: string, data: unknown) {
  const destinationPath = `${dirname}/../dbcJson/${table}.json`

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  await fs.writeFile(destinationPath, JSON.stringify(data), 'utf-8')
}
