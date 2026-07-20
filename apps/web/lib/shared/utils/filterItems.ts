// lib/shared/utils/filterItems.ts

/**
 * Generic filter utility for arrays of objects.
 * Accepts a predicate function that returns a boolean.
 */
export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}
