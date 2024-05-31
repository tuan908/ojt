"use client";

import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import TextHashtag from "@/components/TextHashtag";
import type {StudentsResponse} from "@/types/student.types";
import Analytics from "@mui/icons-material/Analytics";
import {useRouter} from "next/navigation";
import {startTransition, type SyntheticEvent} from "react";

export default function StudentDataGrid({rows}: {rows: StudentsResponse[]}) {
    const router = useRouter();

    const handleRowClick = ({
        e,
        studentCode,
    }: {
        e: SyntheticEvent<HTMLTableRowElement>;
        studentCode?: string;
    }) => {
        e?.stopPropagation();
        const path = `/student/${studentCode}`;
        startTransition(() => {
            router.push(path);
        });
    };

    /**
     * We ensure that only the cell click handler is triggered when both row and cell have click handlers
     * by using e.stopPropagation()
     */
    const handleCellClick = ({
        e,
        studentCode,
    }: {
        e: SyntheticEvent<HTMLTableCellElement>;
        studentCode?: string;
    }): void => {
        e?.stopPropagation();
        const path = `/tracking/student/${studentCode}`;
        startTransition(() => {
            router.push(path);
        });
    };

    return (
        <>
            {/* Table */}
            <div className="w-full px-12">
                <table className="w-full border border-table border-collapse align-middle">
                    <thead className="w-full table table-fixed">
                        <tr className="bg-[#3f51b5] text-[#fffffc]">
                            <TableHead width={8}>学生コード</TableHead>
                            <TableHead width={10}>学生の名前</TableHead>
                            <TableHead width={8}>クラス名</TableHead>
                            <TableHead width={30}>イベント</TableHead>
                            <TableHead width={30}>ハッシュタグ</TableHead>
                            <TableHead width={8}>トラッキング</TableHead>
                        </tr>
                    </thead>
                    <tbody
                        className="block overflow-y-auto table-fixed max-h-[33.875rem]"
                        style={{scrollbarWidth: "none"}}
                    >
                        {rows!?.map(item => {
                            const eventStrings = item.events
                                ?.map(x => x.name)
                                .join(", ");
                            return (
                                <TableRow
                                    key={item.code}
                                    onMouseDown={e =>
                                        handleRowClick({
                                            e,
                                            studentCode: item.code,
                                        })
                                    }
                                >
                                    <TableCell width={8} alignTextCenter>
                                        {item.code}
                                    </TableCell>
                                    <TableCell width={10} alignTextCenter>
                                        {item.name}
                                    </TableCell>
                                    <TableCell width={8} alignTextCenter>
                                        {item.grade}
                                    </TableCell>
                                    <TableCell
                                        width={30}
                                        fontSemibold
                                        textEllipsis
                                        classes="px-2"
                                    >
                                        {eventStrings}
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
                                                    paddingXInRem={0.25}
                                                >
                                                    {hashtag.name}
                                                </TextHashtag>
                                            )
                                        )}
                                    </TableCell>
                                    <TableCell
                                        width={8}
                                        alignTextCenter
                                        onMouseDown={e =>
                                            handleCellClick({
                                                e,
                                                studentCode: item.code,
                                            })
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
