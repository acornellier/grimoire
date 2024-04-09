import { convertSpells } from '../src/convertSpells'

const test = process.argv[2] === '--test'

await convertSpells(test)
