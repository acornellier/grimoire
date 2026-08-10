export const SpellEffectType = {
  schoolDamage: 2,
  environmentalDamage: 7,
} as const

// Bits of SpellMisc.Attributes_5, named after the client's SpellAttr5 enum.
export const SpellAttribute5 = {
  // The aura does a periodic tick the moment it is applied, on top of its
  // regular ticks, so it deals one more tick than its duration allows for.
  extraInitialPeriod: 0x200,
  treatAsAreaEffect: 0x8000,
} as const

export const SpellAuraType = {
  periodicDamage: 3,
  periodicLeech: 53,
} as const

// Auras whose base points are flat damage per tick. Deliberately excludes
// periodic damage percent (89), whose base points are a percentage of the
// target's max health and so don't scale by the damage multiplier.
export const periodicAuraTypes: number[] = [
  SpellAuraType.periodicDamage,
  SpellAuraType.periodicLeech,
]
