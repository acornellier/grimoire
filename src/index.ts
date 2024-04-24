import type { Spell } from './types.ts'
import spellsJson from './spells.json' assert { type: 'json' }

const spells = spellsJson as Spell[]

const spellsById: Record<number, Spell> = spells.reduce(
  (acc, spell) => {
    acc[spell.id] = spell
    return acc
  },
  {} as Record<number, Spell>,
)

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
      spell.damage !== undefined &&
      spell.damage > 0
    )
  })
}

export type { Spell as GrimoireSpell }
