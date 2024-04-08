import type { Spell } from './types.ts'
import fs from 'fs'

let spellsById: Record<number, Spell>

export function initGrimoire(spellsJsonFile: string) {
  const contents = fs.readFileSync(spellsJsonFile)
  const spells = JSON.parse(contents.toString()) as Spell[]
  spellsById = spells.reduce(
    (acc, spell) => {
      acc[spell.id] = spell
      return acc
    },
    {} as Record<number, Spell>,
  )
}

export function getGrimoireSpell(spellId: number): Spell {
  const spell = spellsById[spellId]

  if (!spell) {
    throw new Error(`Could not find spell id ${spellId}`)
  }

  return spell
}

export type { Spell as GrimoireSpell }
