import { Spell } from '../src/types'
import { getDirname, parseJsonFile } from '../src/files'

const dirname = getDirname(import.meta.url)

export const spells = (await parseJsonFile(`${dirname}/spells.json`)) as Spell[]

export const spellsById = spells.reduce<Record<number, Spell>>((acc, spell) => {
  acc[spell.id] = spell
  return acc
}, {})
