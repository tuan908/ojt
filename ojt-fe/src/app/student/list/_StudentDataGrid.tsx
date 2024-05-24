"use client";

import OjtColorTextHashtag from "@/components/ColorTextHashtag";
import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import type {StudentResponseDto} from "@/types/student.types";
import Analytics from "@mui/icons-material/Analytics";
import CircularProgress from "@mui/material/CircularProgress";
import {useRouter} from "next/navigation";
import {Suspense, startTransition, type SyntheticEvent} from "react";

export default function StudentDataGrid({rows}: {rows: StudentResponseDto[]}) {
    const router = useRouter();

    const handleRowClick = ({
        e,
        studentCode,
    }: {
        e: SyntheticEvent<HTMLTableRowElement>;
        studentCode?: string;
    }) => {
        e?.preventDefault();
        router.push(`/student/${studentCode}`, {scroll: true});
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
                    <thead>
                        <tr className="bg-[#3f51b5] text-[#fffffc]">
                            <TableHead>学生コード</TableHead>
                            <TableHead>学生の名前</TableHead>
                            <TableHead>クラス名</TableHead>
                            <TableHead>イベント</TableHead>
                            <TableHead>ハッシュタグ</TableHead>
                            <TableHead>トラッキング</TableHead>
                        </tr>
                    </thead>
                    <tbody>
                        <Suspense fallback={<CircularProgress color="info" />}>
                            {rows
                                ? rows.map(item => {
                                      return (
                                          <TableRow
                                              key={item.code}
                                              onDoubleClick={e =>
                                                  handleRowClick({
                                                      e,
                                                      studentCode: item.code,
                                                  })
                                              }
                                          >
                                              <TableCell alignTextCenter>
                                                  {item.code}
                                              </TableCell>
                                              <TableCell alignTextCenter>
                                                  {item.name}
                                              </TableCell>
                                              <TableCell alignTextCenter>
                                                  {item.grade}
                                              </TableCell>
                                              <TableCell
                                                  fontSemibold
                                                  textEllipsis
                                              >
                                                  {item.events
                                                      ?.map(x => x.name)
                                                      .join(", ")}
                                              </TableCell>
                                              <TableCell
                                                  fontSemibold
                                                  textEllipsis
                                              >
                                                  {item.hashtags?.map(
                                                      (hashtag, index) => (
                                                          <OjtColorTextHashtag
                                                              key={`${hashtag.id}#${index}`}
                                                              color={
                                                                  hashtag.color
                                                              }
                                                              paddingXInRem={
                                                                  0.25
                                                              }
                                                          >
                                                              {hashtag.name}
                                                          </OjtColorTextHashtag>
                                                      )
                                                  )}
                                              </TableCell>
                                              <TableCell
                                                  alignTextCenter
                                                  onClick={e =>
                                                      handleCellClick({
                                                          e,
                                                          studentCode:
                                                              item.code,
                                                      })
                                                  }
                                              >
                                                  <Analytics className="text-icon-default" />
                                              </TableCell>
                                          </TableRow>
                                      );
                                  })
                                : null}
                        </Suspense>
                    </tbody>
                </table>
            </div>
        </>
    );
}
