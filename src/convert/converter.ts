import {
  dbcFiles,
  dbcSpells,
  spellCastTimesById,
  spellEffectsBySpellId,
  spellMiscBySpellId,
  spellNamesById,
} from '../dbcData.ts'
import { Spell } from '../types.ts'
import fs from 'fs/promises'
import { getDirname } from '../util/files.ts'
import path from 'path'
import { getDamage } from './damage.ts'
import { SpellEffectType } from '../constants.ts'

const dirname = getDirname(import.meta.url)

export async function convertAllSpells(test?: boolean) {
  const spellsToConvert = test ? dbcSpells.splice(0, 1000) : dbcSpells

  const spells: Spell[] = spellsToConvert.map(({ ID }, idx) => {
    if (idx % 100000 === 0) console.log(`Converting spell ${idx + 1}/${dbcSpells.length}`)

    return convertSpell(ID)
  })

  const destinationPath = `${dirname}/../spells${test ? '-test' : ''}.json`

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  await fs.writeFile(destinationPath, JSON.stringify(spells), 'utf-8')
}

const optionalField = (field: keyof Spell, value: boolean | number) =>
  value ? { [field]: value } : {}

export function convertSpell(id: number): Spell {
  return {
    id: id,
    name: spellNamesById[id]?.Name_lang ?? 'Unknown',
    icon: getIcon(id),
    ...optionalField('damage', getDamage(id)),
    ...optionalField('aoe', isAoe(id)),
    ...optionalField('physical', isPhysical(id)),
    ...optionalField('variance', getVariance(id)),
    ...optionalField('castTime', getCastTime(id)),
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
        (effect.Effect === SpellEffectType.schoolDamage ||
          effect.Effect === SpellEffectType.environmentalDamage) &&
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

function getCastTime(id: number) {
  const spellMisc = spellMiscBySpellId[id]
  if (!spellMisc) return 0

  const castTimeIndex = spellMisc.CastingTimeIndex
  if (castTimeIndex === 0 || castTimeIndex === 1) return 0

  const castTime = spellCastTimesById[castTimeIndex]
  return castTime?.Base ?? 0
}
