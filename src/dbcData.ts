import {
  ContentTuning,
  ContentTuningXExpected,
  DbcSpell,
  DbcSpellEffect,
  ExpectedStat,
  ExpectedStatMod,
  Files,
  SpellCastTime,
  SpellMisc,
  SpellName,
  SpellRadius,
} from './types'
import { getDirname, parseJsonFile } from './util/files.ts'
import { groupBy, mapBy } from './util/util.ts'

const dirname = getDirname(import.meta.url)

const parseDbcFile = async <T>(filename: string): Promise<T[]> =>
  parseJsonFile(`${dirname}/dbcJson/${filename}.json`)

export const dbcFiles = (await parseJsonFile(`${dirname}/dbcJson/files.json`)) as Files

export const dbcSpells = await parseDbcFile<DbcSpell>('spell')
export const spellNamesById = mapBy(await parseDbcFile<SpellName>('spellname'), 'ID')

export const spellEffects = await parseDbcFile<DbcSpellEffect>('spelleffect')
export const spellEffectsBySpellId = groupBy(spellEffects, 'SpellID')

const spellMiscs = await parseDbcFile<SpellMisc>('spellmisc')
const spellMiscsBySpellId = groupBy(spellMiscs, 'SpellID')

export const spellRadiuses = await parseDbcFile<SpellRadius>('spellradius')
export const spellRadiusesById = mapBy(spellRadiuses, 'ID')

export const spellCastTimes = await parseDbcFile<SpellCastTime>('spellcasttimes')
export const spellCastTimesById = mapBy(spellCastTimes, 'ID')

export const contentTunings = await parseDbcFile<ContentTuning>('contenttuning')
export const contentTuningXExpecteds = await parseDbcFile<ContentTuningXExpected>(
  'contenttuningxexpected',
)

export const expectedStats = await parseDbcFile<ExpectedStat>('expectedstat')
export const expectedStatMods = await parseDbcFile<ExpectedStatMod>('expectedstatmod')
export const expectedStatModsById = mapBy(expectedStatMods, 'ID')

const difficultyIds = {
  mplus: 8,
  mythic: 23,
  heroic: 2,
  normal: 1,
  none: 0,
}

export function findByDifficulty<T extends { DifficultyID: number }>(items: T[]) {
  const byDifficulty = mapBy(items, 'DifficultyID')
  return (
    byDifficulty[difficultyIds.mplus] ??
    byDifficulty[difficultyIds.mythic] ??
    byDifficulty[difficultyIds.heroic] ??
    byDifficulty[difficultyIds.normal] ??
    byDifficulty[difficultyIds.none]
  )
}

export function getSpellMisc(spellId: number): SpellMisc | undefined {
  const spellMiscs = spellMiscsBySpellId[spellId]
  if (!spellMiscs) return undefined
  return findByDifficulty(spellMiscs)
}
