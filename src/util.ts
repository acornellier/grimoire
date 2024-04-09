export function mapBy<T extends object>(array: T[], field: keyof T) {
  return array.reduce(
    (acc, item) => {
      acc[item[field] as number] = item
      return acc
    },
    {} as Record<number, T>,
  )
}

export function groupBy<T extends object>(array: T[], field: keyof T) {
  return array.reduce(
    (acc, item) => {
      const key = item[field] as number
      acc[key] ??= []
      acc[key]!.push(item)
      return acc
    },
    {} as Record<number, T[]>,
  )
}
