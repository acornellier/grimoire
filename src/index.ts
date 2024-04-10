import type { Spell } from './types.ts'
import fs from 'fs'

let spells: Spell[]
let spellsById: Record<number, Spell>

export function initGrimoire(spellsJsonFile: string) {
  if (spellsById) return

  const contents = fs.readFileSync(spellsJsonFile)
  spells = JSON.parse(contents.toString()) as Spell[]
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

export function findDamageSpellsWithName(spellName: string): Spell[] {
  return spells.filter((spell) => {
    return (
      spell.name.toLowerCase().includes(spellName.toLowerCase()) &&
      spell.damage &&
      (spell.damage.s3 > 0 || spell.damage.s4 > 0)
    )
  })
}

export type { Spell as GrimoireSpell }
