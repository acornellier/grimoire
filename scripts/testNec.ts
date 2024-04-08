import { dungeons } from '../nec/backend/dungeons'
import { spellsById } from '../data/spells.ts'

for (const dungeon of dungeons) {
  let good = true
  for (const ability of dungeon.abilities) {
    if (!ability.id) continue

    const spell = spellsById[ability.id]
    if (!spell) {
      console.log(`Spell ${ability.id} not found in spells.json`)
      continue
    }

    if (ability.aoe !== spell.aoe) {
      good = false
      console.error(
        `${ability.name} is ${ability.aoe ? 'AOE' : 'ST'} in NEC, but is ${spell.aoe ? 'AOE' : 'ST'} in Wago`,
      )
    }
  }

  if (good) {
    console.log(`${dungeon.key} matches Wago!`)
  }
}
