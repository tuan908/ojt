"use client";

import OjtColorTextHashtag from "@/components/ColorTextHashtag";
import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import type {StudentResponseDto} from "@/types/student.types";
import Analytics from "@mui/icons-material/Analytics";
import CircularProgress from "@mui/material/CircularProgress";
import {useRouter} from "next/navigation";
import {Suspense, type SyntheticEvent} from "react";

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
        router.push(`/tracking/student/${studentCode}`);
    };

    return (
        <>
            {/* Table */}
            <div className="w-full px-12">
                <table className="w-full border border-table border-collapse align-middle">
                    <thead>
                        <tr className="bg-[#3f51b5] text-[#fffffc]">
                            <TableHead widthInRem={9.141}>
                                Student Code
                            </TableHead>
                            <TableHead widthInRem={9.616}>
                                Student Name
                            </TableHead>
                            <TableHead widthInRem={8.171}>
                                School Year
                            </TableHead>
                            <TableHead widthInRem={40.648}>Event</TableHead>
                            <TableHead widthInRem={22.612}>Hashtag</TableHead>
                            <TableHead widthInRem={6.173}>Tracking</TableHead>
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
                                              <TableCell
                                                  alignTextCenter
                                                  widthInRem={9.141}
                                              >
                                                  {item.code}
                                              </TableCell>
                                              <TableCell
                                                  alignTextCenter
                                                  widthInRem={9.616}
                                              >
                                                  {item.name}
                                              </TableCell>
                                              <TableCell
                                                  alignTextCenter
                                                  widthInRem={8.171}
                                              >
                                                  {item.grade}
                                              </TableCell>
                                              <TableCell
                                                  fontSemibold
                                                  textEllipsis
                                                  widthInRem={40.648}
                                              >
                                                  {item.events
                                                      ?.map(x => x.name)
                                                      .join(", ")}
                                              </TableCell>
                                              <TableCell
                                                  fontSemibold
                                                  textEllipsis
                                                  widthInRem={22.612}
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
                                                  widthInRem={6.173}
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
