"use client";

import TextHashtag from "@/features/students/components/text-hashtag";
import { Button } from "@/shared/components/button";
import DataTable from "@/shared/components/data-table";
import json from "@/shared/i18n/locales/ja.json";
import type { Students } from "@/shared/types";
import { Tooltip } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import { ChartNoAxesCombined } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    rows: Students[];
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

    const columns: ColumnDef<Students>[] = [
        {
            accessorKey: "code",
            header: json.tableHeader.event.code,
            cell: ({ row }) => <>{row.original.code}</>,
        },
        {
            accessorKey: "name",
            header: json.tableHeader.event.name,
            cell: ({ row }) => <>{row.original.name}</>,
        },
        {
            accessorKey: "grade",
            header: json.tableHeader.event.grade,
            cell: ({ row }) => <>{row.original.grade}</>,
        },
        {
            accessorKey: "events",
            header: json.tableHeader.event.events,
            cell: ({ row }) => (
                <div className="px-2 font-semibold truncate">
                    {row.original.events}
                </div>
            ),
        },
        {
            accessorKey: "hashtags",
            header: json.tableHeader.event.hashtags,
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
            header: json.tableHeader.event.tracking,
            cell: ({ row }) => (
                <>
                    <Tooltip title={json.common.viewStatistics}>
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
