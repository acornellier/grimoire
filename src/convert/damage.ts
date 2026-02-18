import {
  contentTuningXExpecteds,
  expectedStatModsById,
  expectedStats,
  getSpellMisc,
} from '../dbcData.ts'
import { DbcSpellEffect, ExpectedStatMod } from '../types.ts'

const level = 90
const expansion = 11
const mythicPlusSeasonId = 117

const backupContentTuningId = 1279
const invalidExpansion = -2

const matchingExpectedStats = expectedStats
  .filter(
    ({ Lvl, ExpansionID }) =>
      Lvl === level && (ExpansionID === expansion || ExpansionID === invalidExpansion),
  )
  .sort((a, b) => b.ExpansionID - a.ExpansionID)

if (matchingExpectedStats.length != 1)
  throw new Error(
    `No or multiple expected stat for level ${level}: ${matchingExpectedStats.toString()}`,
  )

const expectedStat = matchingExpectedStats[0]!

export function getDamage(effect: DbcSpellEffect): number {
  const spellMisc = getSpellMisc(effect.SpellID)
  if (!spellMisc) return 0

  const contentTuningId = backupContentTuningId

  const validXExpecteds = contentTuningXExpecteds
    .filter(
      ({ MinMythicPlusSeasonID, MaxMythicPlusSeasonID }) =>
        (MinMythicPlusSeasonID === 0 || mythicPlusSeasonId >= MinMythicPlusSeasonID) &&
        (MaxMythicPlusSeasonID === 0 || mythicPlusSeasonId < MaxMythicPlusSeasonID),
    )
    .filter(({ ContentTuningID }) => ContentTuningID === contentTuningId)

  const mods = validXExpecteds
    .map(({ ExpectedStatModID }) => expectedStatModsById[ExpectedStatModID])
    .filter((mod): mod is ExpectedStatMod => mod !== undefined)

  let multiplier = expectedStat.CreatureSpellDamage
  for (const mod of mods) {
    multiplier *= mod.CreatureSpellDamageMod
  }

  const value = (multiplier / 100) * effect.EffectBasePointsF

  return Math.round(value)
}
