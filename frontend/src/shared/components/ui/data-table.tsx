'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/components/ui/table';
import {Button} from './button';
import {Pagination, PaginationContent, PaginationItem} from './pagination';

interface IDataTableProps {
  columns: ColumnDef<any>[];
  rows: any[];
  onRowClick?: (row: any) => void;
  pagination?: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}

export default function DataTable({
  columns,
  rows,
  onRowClick,
  pagination,
  setPagination,
}: IDataTableProps) {
  const table = useReactTable({
    columns,
    data: rows ?? [],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: rows.length,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <>
      <div className="w-full border rounded-lg overflow-hidden">
        <Table key={rows.length}>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className="cursor-pointer hover:bg-gray-100">
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className="max-w-72 overflow-hidden text-ellipsis whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full flex py-4 items-center justify-end">
        <div className="lg:w-1/6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table?.firstPage()}
                  disabled={!table?.getCanPreviousPage()}>
                  <ChevronsLeft />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table?.previousPage()}
                  disabled={!table?.getCanNextPage()}>
                  <ChevronLeft />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table?.nextPage()}
                  disabled={!table?.getCanNextPage()}>
                  <ChevronRight />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => table?.lastPage()}
                  disabled={!table?.getCanNextPage()}>
                  <ChevronsRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}
