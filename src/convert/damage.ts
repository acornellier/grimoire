import {
  contentTuningXExpecteds,
  expectedStatModsById,
  expectedStats,
  spellMiscBySpellId,
} from '../dbcData.ts'
import { DbcSpellEffect, ExpectedStatMod } from '../types.ts'

const level = 80
const expansion = 10
const mythicPlusSeasonId = 101
const backupContentTuningId = 1279

export function getDamage(effect: DbcSpellEffect): number {
  const spellMisc = spellMiscBySpellId[effect.SpellID]
  if (!spellMisc) return 0

  const contentTuningId = spellMisc.ContentTuningID || backupContentTuningId

  const expectedStat = expectedStats
    .filter(
      ({ Lvl, ExpansionID }) =>
        Lvl === level && (ExpansionID === expansion || ExpansionID === -2),
    )
    .sort((a, b) => b.ExpansionID - a.ExpansionID)[0]

  if (!expectedStat) throw new Error(`No expected stat for level ${level}`)

  const mods = contentTuningXExpecteds
    .filter(({ ContentTuningID }) => ContentTuningID === contentTuningId)
    .filter(
      ({ MinMythicPlusSeasonID, MaxMythicPlusSeasonID }) =>
        (MinMythicPlusSeasonID === 0 || mythicPlusSeasonId >= MinMythicPlusSeasonID) &&
        (MaxMythicPlusSeasonID === 0 || mythicPlusSeasonId < MaxMythicPlusSeasonID),
    )
    .map(({ ExpectedStatModID }) => expectedStatModsById[ExpectedStatModID])
    .filter((mod): mod is ExpectedStatMod => mod !== undefined)

  let value = expectedStat.CreatureSpellDamage * effect.EffectBasePointsF
  for (const mod of mods) {
    value *= mod.CreatureSpellDamageMod
  }

  return Math.round(value / 100)
}
