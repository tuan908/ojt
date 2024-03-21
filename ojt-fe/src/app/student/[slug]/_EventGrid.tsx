"use client";

import ButtonBase from "@/components/ButtonBase";
import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import {Delete, Done, Edit} from "@/components/icon";
import {EventStatus, UserRole} from "@/constants";
import {useAuth} from "@/lib/hooks/useAuth";
import {type StudentResponseDto} from "@/types/student.types";
import Notifications from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import {Suspense} from "react";
import {StatusLabel} from "./_StatusLabel";

export function EventGrid({data}: {data: StudentResponseDto | null}) {
    const [auth] = useAuth();
    return (
        <table className="w-full border border-table border-collapse align-middle">
            <thead>
                <tr className="bg-[#3f51b5] text-[#fffffc]">
                    <TableHead widthInRem={0}>School Year</TableHead>
                    <TableHead widthInRem={0}>Event</TableHead>
                    <TableHead widthInRem={0}>Status</TableHead>
                    <TableHead widthInRem={0}>Notification</TableHead>
                    {[
                        UserRole.Student.toString(),
                        UserRole.Counselor.toString(),
                    ].indexOf(auth?.role!) > -1 ? (
                        <TableHead widthInRem={0}>Action</TableHead>
                    ) : null}
                </tr>
            </thead>
            <tbody>
                <Suspense fallback={<CircularProgress color="info" />}>
                    {data
                        ? data?.events!?.map(item => (
                              <TableRow key={item.id}>
                                  <TableCell alignTextCenter widthInRem={0}>
                                      {item?.grade}
                                  </TableCell>
                                  <TableCell alignTextCenter widthInRem={0}>
                                      {item?.name}
                                  </TableCell>
                                  <TableCell alignTextCenter widthInRem={0}>
                                      <StatusLabel status={item?.status} />
                                  </TableCell>
                                  <TableCell
                                      fontSemibold
                                      textEllipsis
                                      widthInRem={0}
                                      alignTextCenter
                                  >
                                      <ButtonBase>
                                          <Badge
                                              badgeContent={
                                                  item?.comments?.length
                                              }
                                              color="error"
                                          >
                                              <Notifications className="text-icon-default" />
                                          </Badge>
                                      </ButtonBase>
                                  </TableCell>
                                  {[
                                      UserRole.Student.toString(),
                                      UserRole.Counselor.toString(),
                                  ].indexOf(auth?.role!) > -1 ? (
                                      <TableCell
                                          fontSemibold
                                          textEllipsis
                                          widthInRem={0}
                                      >
                                          <div className="w-full flex justify-center items-center gap-x-6">
                                              {auth?.role! ===
                                              UserRole.Counselor ? (
                                                  <ButtonBase>
                                                      <Done
                                                          isDone={
                                                              item?.status ===
                                                              EventStatus.Confirmed
                                                          }
                                                      />
                                                  </ButtonBase>
                                              ) : (
                                                  <>
                                                      <ButtonBase
                                                          disabled={
                                                              item.status ===
                                                              EventStatus.Confirmed
                                                          }
                                                      >
                                                          <Edit
                                                              disabled={
                                                                  item.status ===
                                                                  EventStatus.Confirmed
                                                              }
                                                          />
                                                      </ButtonBase>
                                                      <ButtonBase
                                                          disabled={
                                                              item.status ===
                                                              EventStatus.Confirmed
                                                          }
                                                      >
                                                          <Delete
                                                              disabled={
                                                                  item.status ===
                                                                  EventStatus.Confirmed
                                                              }
                                                          />
                                                      </ButtonBase>
                                                  </>
                                              )}
                                          </div>
                                      </TableCell>
                                  ) : null}
                              </TableRow>
                          ))
                        : null}
                </Suspense>
            </tbody>
        </table>
    );
}
