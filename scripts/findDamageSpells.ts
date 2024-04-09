import { getDirname } from '../src/files.ts'
import { findDamageSpellsWithName, initGrimoire } from '../src'

const dirname = getDirname(import.meta.url)

const spellName = process.argv[2]
if (!spellName) throw new Error('No spell name provided')

initGrimoire(`${dirname}/../public/spells.json`)

console.log(findDamageSpellsWithName(spellName))
