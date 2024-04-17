import {
  ContentTuning,
  ContentTuningXExpected,
  DbcSpell,
  ExpectedStat,
  ExpectedStatMod,
  Files,
  SpellCastTime,
  SpellEffect,
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

export const spellEffects = await parseDbcFile<SpellEffect>('spelleffect')
export const spellEffectsBySpellId = groupBy(spellEffects, 'SpellID')

export const spellMiscs = await parseDbcFile<SpellMisc>('spellmisc')
export const spellMiscBySpellId = mapBy(spellMiscs, 'SpellID')

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
