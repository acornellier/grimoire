﻿import { Options, parse } from 'csv-parse'
import fs from 'fs/promises'

const stringColumns: Array<string | number> = ['Name_lang']

export async function parseCsvFile<U>(path: string, options: Options): Promise<U[]> {
  const contents = await fs.readFile(path)

  return await parseCsvContents(contents, options)
}

export async function parseCsvContents<U>(
  contents: Buffer | Uint8Array,
  { columns, delimiter }: Options,
): Promise<U[]> {
  const parser = parse({
    columns,
    delimiter,
    cast: (value, context) => {
      if (context.header) {
        return value
      }

      if (stringColumns.includes(context.column)) {
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
