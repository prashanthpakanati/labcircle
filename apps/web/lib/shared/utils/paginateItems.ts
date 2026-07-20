// lib/shared/utils/paginateItems.ts

/**
 * Generic pagination utility.
 * Returns a slice of `items` for the given `page` (1‑based) and `pageSize`.
 */
export function paginateItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
