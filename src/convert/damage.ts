import {
  contentTuningXExpecteds,
  expectedStatModsById,
  expectedStats,
  spellMiscBySpellId,
} from '../dbcData.ts'
import { DbcSpellEffect, ExpectedStatMod } from '../types.ts'

const level = 80
const expansion = 10
const invalidExpansion = -2
const mythicPlusSeasonId = 103
const backupContentTuningId = 1279

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
  const spellMiscs = spellMiscBySpellId[effect.SpellID]
  if (!spellMiscs) return 0

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
