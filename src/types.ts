import { SpellEffectType } from './constants.ts'

export interface SpellEffect {
  // The effect's index in the DBC, so consumers can address an effect
  // explicitly rather than by its position in this array.
  index: number
  damage: number
  variance: number
  aoe: boolean
  // Set on damage-over-time effects. `damage` is then the damage of a single
  // tick, and `ticks` (absent when the spell's duration is unknown or
  // infinite) is how many ticks a full duration deals. `tickOnApply` marks the
  // auras that tick immediately when applied, which is already counted in
  // `ticks`.
  periodic?: true
  period?: number
  ticks?: number
  tickOnApply?: true
}

export interface Spell {
  id: number
  name: string
  icon: string
  effects?: SpellEffect[]
  schools?: string[]
  castTime?: number
  duration?: number
}

export interface Grimoire {
  damageMultiplier: number
  spells: Spell[]
}

export type Files = Record<number, string>

export interface DbcSpell {
  ID: number
}

export interface SpellName {
  ID: number
  Name_lang: string
}

export interface DbcSpellEffect {
  ID: number
  SpellID: number
  EffectIndex: number
  DifficultyID: number
  Effect: (typeof SpellEffectType)[keyof typeof SpellEffectType]
  EffectAura: number
  EffectAuraPeriod: number
  EffectBasePointsF: number
  EffectRadiusIndex_0: number
  EffectRadiusIndex_1: number
  Variance: number
}

export interface SpellMisc {
  ID: number
  SpellID: number
  Attributes_5: number
  SpellIconFileDataID: number
  SchoolMask: number
  ContentTuningID: number
  CastingTimeIndex: number
  DurationIndex: number
  DifficultyID: number
}

export interface SpellRadius {
  ID: number
  Radius: number
}

export interface SpellCastTime {
  ID: number
  Base: number
  Minimum: number
}

export interface SpellDuration {
  ID: number
  Duration: number
  MaxDuration: number
}

export interface ContentTuning {
  ID: number
  ExpansionID: number
  MinLevel: number
  MaxLevel: number
}

export interface ContentTuningXExpected {
  ID: number
  ExpectedStatModID: number
  ContentTuningID: number
  MinMythicPlusSeasonID: number
  MaxMythicPlusSeasonID: number
}

export interface ExpectedStat {
  ID: number
  ExpansionID: number
  CreatureSpellDamage: number
  Lvl: number
}

export interface ExpectedStatMod {
  ID: number
  CreatureSpellDamageMod: number
}

export interface TraitDefinition {
  ID: number
  SpellID: number
  OverrideName_lang: number
  OverrideSubtext_lang: number
  OverrideDescription_lang: number
  OverrideIcon: number
  OverridesSpellID: number
  VisibleSpellID: number
}

export interface TraitNodeEntry {
  ID: number
  TraitDefinitionID: number
  MaxRanks: number
  NodeEntryType: number
  TraitSubTreeID: number
}
