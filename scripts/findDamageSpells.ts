import { Spell } from '../src/types.ts'
import spellsJson from '../src/spells.json' assert { type: 'json' }

const spells = spellsJson as Spell[]

const spellName = process.argv[2]
if (!spellName) throw new Error('No spell name provided')

function findDamageSpellsWithName(spellName: string): Spell[] {
  return spells.filter((spell) => {
    return (
      spell.name.toLowerCase().includes(spellName.toLowerCase()) &&
      spell.effects !== undefined &&
      spell.effects.some(({ damage }) => damage > 0)
    )
  })
}

console.log(findDamageSpellsWithName(spellName))
