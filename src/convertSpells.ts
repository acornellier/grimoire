import { wagoSpellEffects, wagoSpellMisc, wagoSpellNames, wagoSpells } from './wagoData'
import { Spell } from './types'
import fs from 'fs/promises'
import { getDirname } from './files'

const dirname = getDirname(import.meta.url)

console.log('getting aoe spells')

const aoeSpells = getAoeSpells()

export async function convertSpells() {
  const spells: Spell[] = wagoSpells.map((wagoSpell, idx) => {
    if (idx % 1000 === 0) console.log(`Converting spell ${idx + 1}/${wagoSpells.length}`)
    const spellName = wagoSpellNames.find((spellName) => spellName.ID === wagoSpell.ID)

    return {
      id: wagoSpell.ID,
      name: spellName?.Name_lang ?? 'Unknown',
      aoe: aoeSpells.has(wagoSpell.ID),
    }
  })

  await fs.writeFile(`${dirname}/../data/spells.json`, JSON.stringify(spells), 'utf-8')
}

function getAoeSpells() {
  const aoeSpells = new Set<number>()

  for (const spellMisc of wagoSpellMisc) {
    if ((spellMisc.Attributes_5 & 0x8000) > 0) aoeSpells.add(spellMisc.SpellID)
  }

  for (const spellEffect of wagoSpellEffects) {
    // 2 = Spell Damage
    // 7 = Environmental Damage
    // additionally must have some radius indication
    if (
      (spellEffect.Effect === 2 || spellEffect.Effect === 7) &&
      (spellEffect.EffectRadiusIndex_0 > 0 || spellEffect.EffectRadiusIndex_1 > 0)
    ) {
      aoeSpells.add(spellEffect.SpellID)
    }
  }

  return aoeSpells
}
