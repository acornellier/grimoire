import {
  contentTuningXExpecteds,
  expectedStatModsById,
  expectedStats,
  spellEffectsBySpellId,
  spellMiscBySpellId,
} from '../src/dbcData.ts'
import { mapBy } from '../src/util.ts'
import { ExpectedStatMod } from '../src/types.ts'

const level = 70
const expansion = 9
const mythicPlusSeasonId = 98
const backupContentTuningId = 1279

const spellId = 259145
const expectedDamage = 100304

const spellEffect = spellEffectsBySpellId[spellId]
if (!spellEffect) throw new Error(`Spell ${spellId} has no effects`)

const spellMisc = spellMiscBySpellId[spellId]
if (!spellMisc) throw new Error(`Spell ${spellId} has no misc`)

const damageEffects = mapBy(
  spellEffect.filter(({ Effect }) => Effect === 2),
  'DifficultyID',
)

const effect =
  damageEffects[8] ?? // Mythic+, not used anymore?
  damageEffects[23] ?? // Mythic
  damageEffects[2] ?? // Heroic
  damageEffects[1] ?? // Normal
  damageEffects[0] // None

if (effect === undefined)
  throw new Error(`No valid spell effect found for spell ${spellId}`)

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

const damage = value / 100
const res = {
  id: contentTuningId,
  damage: Math.round(damage),
  offBy: Math.round(Math.abs(damage - expectedDamage)),
  ratio: Math.round(10000 * (expectedDamage / damage)) / 10000,
}

console.log(res)
