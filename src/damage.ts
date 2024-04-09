import {
  contentTuningXExpecteds,
  expectedStatModsById,
  expectedStats,
  spellEffectsBySpellId,
  spellMiscBySpellId,
} from './dbcData.ts'
import { mapBy } from './util.ts'
import { ExpectedStatMod } from './types.ts'

const level = 70
const expansion = 9
const mythicPlusSeasonId = 98 // S4 => 100
const backupContentTuningId = 1279

export function getDamage(spellId: number) {
  const spellEffect = spellEffectsBySpellId[spellId]
  if (!spellEffect) return 0

  const spellMisc = spellMiscBySpellId[spellId]
  if (!spellMisc) return 0

  const damageEffects = mapBy(
    spellEffect.filter(({ Effect }) => Effect === 2),
    'DifficultyID',
  )

  const effect =
    damageEffects[8] ?? // Mythic+, not used in S4?
    damageEffects[23] ?? // Mythic
    damageEffects[2] ?? // Heroic
    damageEffects[1] ?? // Normal
    damageEffects[0] // None

  if (effect === undefined) return 0

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
