"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "@mui/material/Pagination";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

type DataTableProps<TData> = {
    columns: any;
    rows: TData[];
    onRowClick?: (row: TData) => void;
};

export function DataTable<TData>({
    columns,
    rows: data,
    onRowClick,
}: DataTableProps<TData>) {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <div className="w-full border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
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
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="w-full flex justify-end items-center pr-6 pt-4">
                <Pagination count={10} variant="text" shape="circular" />
            </div>
        </>
    );
}
