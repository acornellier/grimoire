import { Options, parse } from 'csv-parse'
import fs from 'fs/promises'

export async function parseCsvFile<U>(
  path: string,
  { columns, delimiter }: Options,
): Promise<U[]> {
  const contents = await fs.readFile(path)

  const parser = parse({
    columns,
    delimiter,
    cast: (value, context) => {
      if (context.header) {
        return value
      }

      const num = Number(value)
      return Number.isNaN(num) ? value : num
    },
  })

  parser.write(contents)
  parser.end()

  const data: U[] = []

  for await (const record of parser) {
    data.push(record as U)
  }

  return data
}

export async function parseCsvUrl<U>(
  url: string,
  { columns, delimiter }: Options,
): Promise<U[]> {
  const response = await fetch(url)

  if (!response.body) {
    throw new Error(`No response body for url ${url}`)
  }

  const parser = parse({
    columns,
    delimiter,
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

  return data
}
