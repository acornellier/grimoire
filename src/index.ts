import type { Spell } from './types.ts'
import spellsJson from './data/spells.json'

export const spells = spellsJson as Spell[]

export const spellsById = spells.reduce<Record<number, Spell>>((acc, spell) => {
  acc[spell.id] = spell
  return acc
}, {})
