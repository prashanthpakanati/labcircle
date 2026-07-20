// lib/shared/utils/sortItems.ts

/**
 * Generic sort utility for arrays of objects.
 * `key` is the property to sort by. `direction` can be 'asc' or 'desc'.
 */
export function sortItems<T>(items: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  const sorted = [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    return direction === 'asc' ? 1 : -1;
  });
  return sorted;
}
