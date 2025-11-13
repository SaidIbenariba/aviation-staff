import { type ColumnDef } from "@tanstack/react-table";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableState {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: Array<{ id: string; desc: boolean }>;
}

export function getFilteredData<T>(
  data: T[],
  search: string,
  searchableColumns: (keyof T)[],
): T[] {
  if (!search) return data;

  const searchLower = search.toLowerCase();
  return data.filter((item) =>
    searchableColumns.some((column) => {
      const value = item[column];
      return value
        ? String(value).toLowerCase().includes(searchLower)
        : false;
    }),
  );
}

export function getPaginatedData<T>(
  data: T[],
  pageIndex: number,
  pageSize: number,
): T[] {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

export function getSortedData<T>(
  data: T[],
  sorting: Array<{ id: string; desc: boolean }>,
): T[] {
  if (!sorting.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const { id, desc } = sort;
      const aValue = (a as Record<string, unknown>)[id];
      const bValue = (b as Record<string, unknown>)[id];

      if (aValue === bValue) continue;

      const aStr = String(aValue ?? "");
      const bStr = String(bValue ?? "");

      if (desc) {
        return bStr.localeCompare(aStr);
      }
      return aStr.localeCompare(bStr);
    }
    return 0;
  });
}

export function getFilteredSortedPaginatedData<T>(
  data: T[],
  state: DataTableState,
  searchableColumns: (keyof T)[],
): { data: T[]; total: number } {
  let filtered = getFilteredData(data, state.search, searchableColumns);
  const total = filtered.length;
  filtered = getSortedData(filtered, state.sorting);
  filtered = getPaginatedData(
    filtered,
    state.pageIndex,
    state.pageSize,
  );

  return { data: filtered, total };
}

