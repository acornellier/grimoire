import { SpellEffectType } from './constants.ts'

export interface SpellEffect {
  damage: number
  variance: number
  aoe: boolean
}

export interface Spell {
  id: number
  name: string
  icon: string
  effects?: SpellEffect[]
  schools?: string[]
  castTime?: number
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
