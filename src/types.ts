export interface Table {
  name: string
}

export interface WagoSpell {
  ID: number
}

export interface WagoSpellName {
  ID: number
  Name_lang: string
}

export interface WagoSpellEffect {
  ID: number
  SpellID: number
  Effect: number
  EffectRadiusIndex_0: number
  EffectRadiusIndex_1: number
}

export interface WagoSpellMisc {
  ID: number
  SpellID: number
  Attributes_5: number
}

export interface Spell {
  id: number
  name: string
  // icon: string
  aoe: boolean
  // variance: number
}
