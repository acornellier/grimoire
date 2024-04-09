import { convertAllSpells, convertSpell } from '../src/convertAllSpells.ts'

const arg = process.argv[2]
const testAll = arg === 'test'

if (arg && !testAll) console.log(convertSpell(Number(arg)))
else await convertAllSpells(testAll)
