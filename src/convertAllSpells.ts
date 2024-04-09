import {
  dbcFiles,
  dbcSpells,
  spellEffectsBySpellId,
  spellMiscBySpellId,
  spellNamesById,
} from './dbcData.ts'
import { Spell } from './types'
import fs from 'fs/promises'
import { getDirname } from './files'
import path from 'path'
import { getDamage } from './damage.ts'

const dirname = getDirname(import.meta.url)

export async function convertAllSpells(test?: boolean) {
  const spellsToConvert = test ? dbcSpells.splice(0, 1000) : dbcSpells

  const spells: Spell[] = spellsToConvert.map(({ ID }, idx) => {
    if (idx % 10000 === 0) console.log(`Converting spell ${idx + 1}/${dbcSpells.length}`)

    return convertSpell(ID)
  })

  await fs.writeFile(
    `${dirname}/../public/spells${test ? '-test' : ''}.json`,
    JSON.stringify(spells),
    'utf-8',
  )
}

export function convertSpell(id: number) {
  return {
    id: id,
    name: spellNamesById[id]?.Name_lang ?? 'Unknown',
    icon: getIcon(id),
    damage: { s3: getDamage(id, 's3'), s4: getDamage(id, 's4') },
    aoe: isAoe(id),
    physical: isPhysical(id),
    variance: getVariance(id),
  }
}

function getIcon(id: number) {
  const spellMisc = spellMiscBySpellId[id]
  if (!spellMisc) return 'inv_misc_questionmark'

  const file = dbcFiles[spellMisc?.SpellIconFileDataID]
  if (!file) return 'inv_misc_questionmark'

  return path.parse(file).name
}

function isAoe(id: number): boolean {
  const spellMisc = spellMiscBySpellId[id]
  if (spellMisc && (spellMisc.Attributes_5 & 0x8000) > 0) return true

  const spellEffects = spellEffectsBySpellId[id]
  return (
    !!spellEffects &&
    spellEffects.some(
      (effect) =>
        (effect.Effect === 2 || effect.Effect === 7) &&
        (effect['EffectRadiusIndex[0]'] > 0 || effect['EffectRadiusIndex[1]'] > 0),
    )
  )
}

function isPhysical(ID: number): boolean {
  const spellMisc = spellMiscBySpellId[ID]
  return !!spellMisc && spellMisc.SchoolMask === 1
}

function getVariance(id: number) {
  const spellEffects = spellEffectsBySpellId[id]
  if (!spellEffects) return 0

  const damageEffect = spellEffects.find(({ Effect }) => Effect === 2)
  if (!damageEffect) return 0

  return damageEffect.Variance
}
