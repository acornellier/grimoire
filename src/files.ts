import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs/promises'

export function getDirname(file: string) {
  const __filename = fileURLToPath(file)
  return path.dirname(__filename)
}

export async function parseJsonFile(file: string) {
  const contents = await fs.readFile(file)
  return JSON.parse(contents.toString())
}
