import { parseJsonFile, getDirname } from '../src/util/files.ts'
import { groupBy } from '../src/util/util.ts'
import type { TraitDefinition, TraitNodeEntry } from '../src/types.ts'

const dirname = getDirname(import.meta.url)

const spellId = Number(process.argv[2])
if (!spellId) throw new Error('Usage: yarn traitNodeEntry <spellId>')

const traitDefinitions: TraitDefinition[] = await parseJsonFile(
  `${dirname}/../src/dbcJson/traitdefinition.json`,
)
const traitNodeEntries: TraitNodeEntry[] = await parseJsonFile(
  `${dirname}/../src/dbcJson/traitnodeentry.json`,
)

const traitNodeEntriesByDefinitionId = groupBy(traitNodeEntries, 'TraitDefinitionID')

const matchingDefinitions = traitDefinitions.filter(
  (definition) => definition.SpellID === spellId,
)

if (matchingDefinitions.length === 0) {
  console.log(`No TraitDefinitions found with SpellID ${spellId}`)
  process.exit(0)
}

console.log(`Found ${matchingDefinitions.length} TraitDefinition(s) for SpellID ${spellId}:\n`)

for (const definition of matchingDefinitions) {
  console.log(`TraitDefinition ID: ${definition.ID}`)
  console.log(definition)

  const entries = traitNodeEntriesByDefinitionId[definition.ID] ?? []
  if (entries.length === 0) {
    console.log(`  No TraitNodeEntries found\n`)
  } else {
    console.log(`${entries.length} TraitNodeEntry(s):`)
    for (const entry of entries) {
      console.log(entry)
    }
    console.log()
  }
}
