import path from 'path'
import fs from 'fs/promises'
import { parse } from 'csv-parse'
import { Table } from './types'
import { getDirname } from './files'

const dirname = getDirname(import.meta.url)

function resolveLocalWagoCachePath(tableName: string): string {
  return `${dirname}/wago/${tableName}.json`
}

export async function getWagoAsset<U>(table: Table): Promise<U[] | null> {
  const destinationPath = resolveLocalWagoCachePath(table.name)

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  const url = `https://wago.tools/db2/${table.name}/csv`

  const response = await fetch(url)

  if (!response.body) {
    throw new Error(`No response body for url ${url}`)
  }

  const parser = parse({
    columns: true,
    cast: (value, context) => {
      if (context.header) {
        return value
      }

      const num = Number(value)
      return Number.isNaN(num) ? value : num
    },
  })

  await response.body.pipeTo(
    new WritableStream<Uint8Array>({
      write(chunk: any) {
        parser.write(chunk)
      },
      close() {
        parser.end()
      },
    }),
  )

  const data: U[] = []

  for await (const record of parser) {
    data.push(record as U)
  }

  await fs.writeFile(destinationPath, JSON.stringify(data), 'utf-8')

  return data
}
