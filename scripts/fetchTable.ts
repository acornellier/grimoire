import { getWagoAsset } from '../src/downloadTable'

const tableName = process.argv[2]

if (!tableName) throw new Error(`Missing table name`)

await getWagoAsset({ name: tableName })
