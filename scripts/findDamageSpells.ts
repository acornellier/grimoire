import { findDamageSpellsWithName } from '../src'

const spellName = process.argv[2]
if (!spellName) throw new Error('No spell name provided')

console.log(findDamageSpellsWithName(spellName))
