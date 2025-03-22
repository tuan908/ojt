"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import TextHashtag from "@/components/ui/text-hashtag";
import json from "@/i18n/locales/ja.json";
import type { StudentsResponse } from "@/types/student";
import { Tooltip } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { ChartNoAxesCombined } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    rows: StudentsResponse[];
};

export default function StudentDataGrid({ rows }: Props) {
    const router = useRouter();

    const handleRowClick = (studentCode?: string) => {
        if (!studentCode) return;
        router.push(`/students/${studentCode}`);
    };

    const handleCellClick = (studentCode?: string) => {
        if (!studentCode) return;
        router.push(`/students/${studentCode}/trackings`);
    };

    const columns: ColumnDef<StudentsResponse>[] = [
        {
            accessorKey: "code",
            header: json.table.header.event.code,
            cell: ({ row }) => <>{row.original.code}</>,
        },
        {
            accessorKey: "name",
            header: json.table.header.event.name,
            cell: ({ row }) => <>{row.original.name}</>,
        },
        {
            accessorKey: "grade",
            header: json.table.header.event.grade,
            cell: ({ row }) => <>{row.original.grade}</>,
        },
        {
            accessorKey: "events",
            header: json.table.header.event.events,
            cell: ({ row }) => (
                <div className="px-2 font-semibold truncate">
                    {row.original.events}
                </div>
            ),
        },
        {
            accessorKey: "hashtags",
            header: json.table.header.event.hashtags,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.hashtags?.map((hashtag, index) => (
                        <TextHashtag
                            key={`${hashtag.id}#${index}`}
                            color={hashtag.color}
                            px={0.25}
                        >
                            {hashtag.name}
                        </TextHashtag>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "tracking",
            header: json.table.header.event.tracking,
            cell: ({ row }) => (
                <>
                    <Tooltip title={json.common.view_statistics}>
                        <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCellClick(row.original.code)}
                        >
                            <ChartNoAxesCombined className="w-5 h-5 text-icon-default" />
                        </Button>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <div className="w-full px-12">
            <DataTable
                columns={columns}
                rows={rows ?? []}
                onRowClick={row => handleRowClick(row.code)}
            />
        </div>
    );
}
