import type { Grimoire, Spell, SpellEffect } from './types.ts'
import spellsJson from './spells.json' assert { type: 'json' }

const { damageMultiplier, spells } = spellsJson as Grimoire

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

// The factor an effect's base points are multiplied by to get its damage:
// damage = round(damageMultiplier * EffectBasePointsF)
export function getDamageMultiplier(): number {
  return damageMultiplier
}

export type { Spell as GrimoireSpell, SpellEffect as GrimoireSpellEffect }
