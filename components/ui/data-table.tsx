"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import type { DataTableState } from "@/lib/utils/data-table";
import { getFilteredSortedPaginatedData } from "@/lib/utils/data-table";

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchableColumns?: (keyof T)[];
  initialState?: Partial<DataTableState>;
}

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  data,
  columns,
  searchableColumns,
  initialState,
}: DataTableProps<T>) {
  const [state, setState] = React.useState<DataTableState>({
    pageIndex: 0,
    pageSize: 10,
    search: "",
    sorting: [],
    ...initialState,
  });

  const searchableCols = searchableColumns ?? (columns.map((c) => c.accessorKey).filter(Boolean) as (keyof T)[]);

  const { data: processedData, total } = getFilteredSortedPaginatedData(
    data,
    state,
    searchableCols,
  );

  const totalPages = Math.ceil(total / state.pageSize);

  const handleSort = (columnId: string) => {
    setState((prev) => {
      const existingSort = prev.sorting.find((s) => s.id === columnId);
      let newSorting: Array<{ id: string; desc: boolean }>;

      if (existingSort) {
        if (existingSort.desc) {
          newSorting = prev.sorting.filter((s) => s.id !== columnId);
        } else {
          newSorting = prev.sorting.map((s) =>
            s.id === columnId ? { ...s, desc: true } : s,
          );
        }
      } else {
        newSorting = [...prev.sorting, { id: columnId, desc: false }];
      }

      return { ...prev, sorting: newSorting, pageIndex: 0 };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(state.pageSize)}
            onValueChange={(value) => {
              setState((prev) => ({
                ...prev,
                pageSize: Number(value),
                pageIndex: 0,
              }));
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Search:</span>
          <Input
            type="text"
            placeholder="Search..."
            value={state.search}
            onChange={(e) => {
              setState((prev) => ({ ...prev, search: e.target.value, pageIndex: 0 }));
            }}
            className="w-[200px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.id)}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      {column.header}
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available in table
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell
                        ? column.cell(row)
                        : column.accessorKey
                          ? String(row[column.accessorKey] ?? "")
                          : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {state.pageIndex * state.pageSize + 1} to{" "}
          {Math.min((state.pageIndex + 1) * state.pageSize, total)} of {total}{" "}
          entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                pageIndex: Math.max(0, prev.pageIndex - 1),
              }));
            }}
            disabled={state.pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (state.pageIndex < 3) {
                pageNum = i + 1;
              } else if (state.pageIndex > totalPages - 4) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = state.pageIndex - 1 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={state.pageIndex === pageNum - 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setState((prev) => ({ ...prev, pageIndex: pageNum - 1 }));
                  }}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && state.pageIndex < totalPages - 3 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setState((prev) => ({ ...prev, pageIndex: totalPages - 1 }));
                  }}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1),
              }));
            }}
            disabled={state.pageIndex >= totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

