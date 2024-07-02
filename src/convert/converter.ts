import {
  dbcFiles,
  dbcSpells,
  spellCastTimesById,
  spellEffectsBySpellId,
  spellMiscBySpellId,
  spellNamesById,
} from '../dbcData.ts'
import { DbcSpellEffect, Spell, SpellEffect } from '../types.ts'
import fs from 'fs/promises'
import { getDirname } from '../util/files.ts'
import path from 'path'
import { getDamage } from './damage.ts'
import { SpellEffectType } from '../constants.ts'
import { groupBy, mapBy } from '../util/util.ts'

const dirname = getDirname(import.meta.url)

export async function convertAllSpells(test?: boolean) {
  const spellsToConvert = test ? dbcSpells.splice(0, 100_000) : dbcSpells

  const spells: Spell[] = spellsToConvert.map(({ ID }, idx) => {
    if (idx % 100000 === 0)
      console.log(`Converting spell ${idx + 1}/${spellsToConvert.length}`)

    return convertSpell(ID)
  })

  const destinationPath = `${dirname}/../spells.json`

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  await fs.writeFile(destinationPath, JSON.stringify(spells), 'utf-8')
}

const optionalField = (
  field: keyof Spell,
  value: boolean | number | unknown[] | undefined,
) => (value ? { [field]: value } : {})

const optionalArrayField = (field: keyof Spell, value: unknown[] | undefined) =>
  value && value.length > 0 ? { [field]: value } : {}

export function convertSpell(id: number): Spell {
  return {
    id: id,
    name: spellNamesById[id]?.Name_lang ?? 'Unknown',
    icon: getIcon(id),
    // ...optionalArrayField('effects', getEffects(id)),
    ...optionalArrayField('schools', getSchools(id)),
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

function getEffects(id: number): SpellEffect[] | undefined {
  const effects = spellEffectsBySpellId[id]
  if (!effects) return undefined

  const effectIndexes = groupBy(effects, 'EffectIndex')

  return Object.values(effectIndexes)
    .map<SpellEffect | undefined>((indexEffects) => {
      const damageEffects = mapBy(
        indexEffects.filter(({ Effect }) => Effect === 2),
        'DifficultyID',
      )

      const effect =
        damageEffects[8] ?? // Mythic+
        damageEffects[23] ?? // Mythic
        damageEffects[2] ?? // Heroic
        damageEffects[1] ?? // Normal
        damageEffects[0] // None

      if (!effect) return undefined

      return {
        damage: getDamage(effect),
        aoe: isAoe(effect),
        variance: getVariance(effect),
      }
    })
    .filter(Boolean) as SpellEffect[]
}

function isAoe(effect: DbcSpellEffect): boolean {
  const spellMisc = spellMiscBySpellId[effect.SpellID]
  if (spellMisc && (spellMisc['Attributes[5]'] & 0x8000) > 0) return true

  return (
    (effect.Effect === SpellEffectType.schoolDamage ||
      effect.Effect === SpellEffectType.environmentalDamage) &&
    (effect['EffectRadiusIndex[0]'] > 0 || effect['EffectRadiusIndex[1]'] > 0)
  )
}

const schools: Array<[number, string]> = [
  [1, 'physical'],
  [2, 'holy'],
  [4, 'fire'],
  [8, 'nature'],
  [16, 'frost'],
  [32, 'shadow'],
  [64, 'arcane'],
]

function getSchools(ID: number): string[] | undefined {
  const spellMisc = spellMiscBySpellId[ID]
  if (!spellMisc || spellMisc.SchoolMask === 0) return undefined

  return schools.reduce((acc, [flag, school]) => {
    if (spellMisc.SchoolMask & flag) acc.push(school)
    return acc
  }, [] as string[])
}

function getVariance(dbcEffect: DbcSpellEffect) {
  const spellEffects = spellEffectsBySpellId[dbcEffect.SpellID]
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
