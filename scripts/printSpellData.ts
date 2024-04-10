import { getGrimoireSpell, initGrimoire } from '../src'
import { getDirname } from '../src/util/files.ts'

const dirname = getDirname(import.meta.url)

initGrimoire(`${dirname}/../public/spells.json`)

console.log(getGrimoireSpell(Number(process.argv[2])))
