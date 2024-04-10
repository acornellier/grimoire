import { convertAllSpells, convertSpell } from '../src/convert/converter.ts'

const arg = process.argv[2]
const testAll = arg === 'test'

if (arg && !testAll) console.log(convertSpell(Number(arg)))
else await convertAllSpells(testAll)
