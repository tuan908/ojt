"use client";

import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import TextHashtag from "@/components/TextHashtag";
import json from "@/i18n/jp.json";
import type {StudentsResponse} from "@/types/student.types";
import Analytics from "@mui/icons-material/Analytics";
import {useRouter} from "next/navigation";
import {startTransition, type SyntheticEvent} from "react";

type Props = {
    rows: StudentsResponse[];
};

export default function StudentDataGrid(props: Props) {
    const {rows} = props;
    const router = useRouter();

    const handleRowClick = (
        event: SyntheticEvent<HTMLTableRowElement>,
        studentCode?: string
    ) => {
        event?.stopPropagation();
        const path = `/students/${studentCode}`;
        startTransition(() => {
            router.push(path);
        });
    };

    /**
     * We ensure that only the cell click handler is triggered when both row and cell have click handlers
     * by using e.stopPropagation()
     */
    const handleCellClick = (
        event: SyntheticEvent<HTMLTableCellElement>,
        studentCode?: string
    ): void => {
        event?.stopPropagation();
        const path = `/trackings/${studentCode}`;
        startTransition(() => {
            router.push(path);
        });
    };

    return (
        <>
            {/* Table */}
            <div className="w-full px-12">
                <table className="w-full border border-table border-collapse align-middle">
                    <thead>
                        <tr className="bg-[#3f51b5] text-[#fffffc]">
                            <TableHead width={8}>
                                {json.table.header.event.code}
                            </TableHead>
                            <TableHead width={10}>
                                {json.table.header.event.name}
                            </TableHead>
                            <TableHead width={8}>
                                {json.table.header.event.grade}
                            </TableHead>
                            <TableHead width={30}>
                                {json.table.header.event.events}
                            </TableHead>
                            <TableHead width={30}>
                                {json.table.header.event.hashtags}
                            </TableHead>
                            <TableHead width={8}>
                                {json.table.header.event.tracking}
                            </TableHead>
                        </tr>
                    </thead>
                    <tbody>
                        {rows!?.map(item => {
                            return (
                                <TableRow
                                    key={item.id}
                                    onMouseDown={event =>
                                        handleRowClick(event, item.code)
                                    }
                                >
                                    <TableCell width={8} textCenter>
                                        {item.code}
                                    </TableCell>
                                    <TableCell width={10} textCenter>
                                        {item.name}
                                    </TableCell>
                                    <TableCell width={8} textCenter>
                                        {item.grade}
                                    </TableCell>
                                    <TableCell
                                        width={30}
                                        fontSemibold
                                        textEllipsis
                                        classes="px-2"
                                    >
                                        {item.events}
                                    </TableCell>
                                    <TableCell
                                        width={30}
                                        fontSemibold
                                        textEllipsis
                                    >
                                        {item.hashtags?.map(
                                            (hashtag, index) => (
                                                <TextHashtag
                                                    key={`${hashtag.id}#${index}`}
                                                    color={hashtag.color}
                                                    px={0.25}
                                                >
                                                    {hashtag.name}
                                                </TextHashtag>
                                            )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        width={8}
                                        textCenter
                                        onMouseDown={event =>
                                            handleCellClick(event, item.code)
                                        }
                                    >
                                        <Analytics className="text-icon-default" />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
