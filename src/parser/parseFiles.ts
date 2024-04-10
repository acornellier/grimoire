import { getDirname } from '../util/files.ts'
import { parseCsvUrl } from './parseCsv.ts'
import fs from 'fs/promises'
import path from 'path'

const dirname = getDirname(import.meta.url)

export async function getWagoFiles() {
  const data = await parseCsvUrl<[number, string]>(
    'https://github.com/wowdev/wow-listfile/releases/latest/download/community-listfile.csv',
    {
      columns: false,
      delimiter: ';',
    },
  )

  const dataRecord = data.reduce(
    (acc, [id, file]) => {
      acc[id] = file
      return acc
    },
    {} as Record<number, string>,
  )

  const destinationPath = `${dirname}/../dbcJson/files.json`

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  await fs.writeFile(destinationPath, JSON.stringify(dataRecord), 'utf-8')
}
