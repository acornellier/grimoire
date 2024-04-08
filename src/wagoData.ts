import type { WagoSpell, WagoSpellEffect, WagoSpellMisc, WagoSpellName } from './types'
import { getDirname, parseJsonFile } from './files'

const dirname = getDirname(import.meta.url)

const parseWagoFile = async (filename: string) =>
  parseJsonFile(`${dirname}/wago/${filename}.json`)

export const wagoSpells = (await parseWagoFile('Spell')) as WagoSpell[]
export const wagoSpellNames = (await parseWagoFile('SpellName')) as WagoSpellName[]
export const wagoSpellEffects = (await parseWagoFile('SpellEffect')) as WagoSpellEffect[]
export const wagoSpellMisc = (await parseWagoFile('SpellMisc')) as WagoSpellMisc[]
