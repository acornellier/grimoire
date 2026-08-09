import {
  dbcFiles,
  dbcSpells,
  findByDifficulty,
  getSpellMisc,
  spellCastTimesById,
  spellDurationsById,
  spellEffectsBySpellId,
  spellNamesById,
} from '../dbcData.ts'
import { DbcSpellEffect, Grimoire, Spell, SpellEffect } from '../types.ts'
import fs from 'fs/promises'
import { getDirname } from '../util/files.ts'
import path from 'path'
import { damageMultiplier, getDamage } from './damage.ts'
import { periodicAuraTypes, SpellEffectType } from '../constants.ts'
import { groupBy } from '../util/util.ts'

const dirname = getDirname(import.meta.url)

export async function convertAllSpells(test?: boolean) {
  const spellsToConvert = test ? dbcSpells.splice(0, 100_000) : dbcSpells

  const spells: Spell[] = spellsToConvert.map(({ ID }, idx) => {
    if (idx % 100000 === 0)
      console.log(`Converting spell ${idx + 1}/${spellsToConvert.length}`)

    return convertSpell(ID)
  })

  const grimoire: Grimoire = { damageMultiplier, spells }

  const destinationPath = `${dirname}/../spells.json`

  await fs.mkdir(destinationPath.split(path.sep).slice(0, -1).join(path.sep), {
    recursive: true,
  })

  await fs.writeFile(destinationPath, JSON.stringify(grimoire), 'utf-8')
}

const optionalField = (
  field: keyof Spell,
  value: boolean | number | unknown[] | undefined,
) => (value ? { [field]: value } : {})

const optionalArrayField = (field: keyof Spell, value: unknown[] | undefined) =>
  value && value.length > 0 ? { [field]: value } : {}

export function convertSpell(id: number): Spell {
  const duration = getDuration(id)

  return {
    id: id,
    name: spellNamesById[id]?.Name_lang ?? 'Unknown',
    icon: getIcon(id),
    ...optionalArrayField('effects', getEffects(id, duration)),
    ...optionalArrayField('schools', getSchools(id)),
    ...optionalField('castTime', getCastTime(id)),
    ...optionalField('duration', duration),
  }
}

function getIcon(id: number) {
  const spellMisc = getSpellMisc(id)
  if (!spellMisc) return 'inv_misc_questionmark'

  const file = dbcFiles[spellMisc?.SpellIconFileDataID]
  if (!file) return 'inv_misc_questionmark'

  return path.parse(file).name.replace(' ', '-')
}

function getEffects(id: number, duration: number): SpellEffect[] | undefined {
  const effects = spellEffectsBySpellId[id]
  if (!effects) return undefined

  const effectIndexes = groupBy(effects, 'EffectIndex')

  return Object.keys(effectIndexes)
    .map(Number)
    .sort((a, b) => a - b)
    .map<SpellEffect | undefined>((index) => {
      const damageEffects = effectIndexes[index]!.filter(isDamageEffect)
      const effect = findByDifficulty(damageEffects)

      if (!effect) return undefined

      return {
        index,
        damage: getDamage(effect),
        aoe: isAoe(effect),
        variance: effect.Variance,
        ...getPeriodic(effect, duration),
      }
    })
    .filter(Boolean) as SpellEffect[]
}

function isDamageEffect(effect: DbcSpellEffect): boolean {
  return effect.Effect === SpellEffectType.schoolDamage || isPeriodicEffect(effect)
}

// A periodic aura's base points are the damage of a single tick.
function isPeriodicEffect(effect: DbcSpellEffect): boolean {
  return (
    effect.Effect !== SpellEffectType.schoolDamage &&
    periodicAuraTypes.includes(effect.EffectAura) &&
    effect.EffectAuraPeriod > 0
  )
}

function getPeriodic(effect: DbcSpellEffect, duration: number) {
  if (!isPeriodicEffect(effect)) return {}

  const period = effect.EffectAuraPeriod

  // A duration of 0 is unknown and a negative one is infinite, so in neither
  // case can the number of ticks be derived.
  if (duration <= 0) return { periodic: true as const, period }

  return {
    periodic: true as const,
    period,
    ticks: Math.max(1, Math.round(duration / period)),
  }
}

function isAoe(effect: DbcSpellEffect): boolean {
  const spellMisc = getSpellMisc(effect.SpellID)
  if (spellMisc && (spellMisc.Attributes_5 & 0x8000) > 0) return true

  return effect.EffectRadiusIndex_0 > 0 || effect.EffectRadiusIndex_1 > 0
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

function getSchools(id: number): string[] | undefined {
  const spellMisc = getSpellMisc(id)
  if (!spellMisc || spellMisc.SchoolMask === 0) return undefined

  return schools.reduce((acc, [flag, school]) => {
    if (spellMisc.SchoolMask & flag) acc.push(school)
    return acc
  }, [] as string[])
}

function getCastTime(id: number) {
  const spellMisc = getSpellMisc(id)
  if (!spellMisc) return 0

  const castTimeIndex = spellMisc.CastingTimeIndex
  if (castTimeIndex === 0 || castTimeIndex === 1) return 0

  const castTime = spellCastTimesById[castTimeIndex]
  return castTime?.Base ?? 0
}

function getDuration(id: number) {
  const spellMisc = getSpellMisc(id)
  if (!spellMisc) return 0

  const durationIndex = spellMisc.DurationIndex
  if (durationIndex === 0) return 0

  return spellDurationsById[durationIndex]?.Duration ?? 0
}
