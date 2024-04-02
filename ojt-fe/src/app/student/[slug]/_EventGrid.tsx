"use client";

import {deleteEventDetailById} from "@/app/actions/event";
import {updateEventStatus} from "@/app/actions/student";
import ButtonBase from "@/components/ButtonBase";
import CustomDialog from "@/components/CustomDialog";
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
import {createAction, createReducer} from "@reduxjs/toolkit";
import {useRouter} from "next/navigation";
import {Suspense, useReducer, useState, type SyntheticEvent} from "react";
import {StatusLabel} from "./_StatusLabel";

const showDialogDelete = createAction<{id: number}>("MODAL/DELETE");
const showDialogUpdateStatus = createAction<{id: number}>(
    "MODAL/UPDATE_STATUS"
);

const hideDialogDelete = createAction("MODAL/DELETE");
const hideDialogUpdateStatus = createAction("MODAL/UPDATE_STATUS");

const initialState = {
    delete: {
        open: false,
        id: -1,
    },
    updateStatus: {
        open: false,
        id: -1,
    },
};

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(showDialogDelete, (state, action) => {
            state.delete.open = true;
            state.delete.id = action.payload.id;
        })
        .addCase(hideDialogDelete, state => {
            state.delete.open = false;
            state.delete.id = -1;
        })
        .addCase(showDialogUpdateStatus, (state, action) => {
            state.updateStatus.open = true;
            state.updateStatus.id = action.payload.id;
        })
        .addCase(hideDialogUpdateStatus, state => {
            state.updateStatus.open = false;
            state.updateStatus.id = -1;
        });
});

export function EventGrid({data}: {data: StudentResponseDto | null}) {
    const {auth} = useAuth();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(-1);
    const router = useRouter();
    const [state, localDispatch] = useReducer(reducer, initialState);

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    async function handleDone(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
        id: number
    ) {
        event.preventDefault();
        const actionResponse = await updateEventStatus({
            id,
            studentId: data?.id!?.toString(),
            updatedBy: auth?.username!,
        });
        closeDialog();
    }

    function handleEdit(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
        id: number
    ): void {
        event?.preventDefault();
        let url = `/event?id=${id}&mode=edit`;
        router.push(url);
    }

    function handleNotificationIconClick(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
        id: number
    ) {
        event?.preventDefault();
        let url = `/event?id=${id}&mode=chat`;
        router.push(url);
    }

    function handleCancelClick(): void {
        closeDialog();
    }

    function handleDeleteEventDetailById(): void {
        deleteEventDetailById(id);
        closeDialog();
    }

    return (
        <>
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
                                          <ButtonBase
                                              onClick={e =>
                                                  handleNotificationIconClick(
                                                      e,
                                                      item.id
                                                  )
                                              }
                                          >
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
                                                      <ButtonBase
                                                          onClick={() =>
                                                              localDispatch(
                                                                  showDialogDelete(
                                                                      {
                                                                          id: item.id,
                                                                      }
                                                                  )
                                                              )
                                                          }
                                                          disabled={
                                                              item?.status ===
                                                              EventStatus.Confirmed
                                                          }
                                                      >
                                                          <Done
                                                              isDone={
                                                                  item?.status !==
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
                                                              onClick={e =>
                                                                  handleEdit(
                                                                      e,
                                                                      item.id
                                                                  )
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
                                                              onClick={() => {
                                                                  openDialog();
                                                                  setId(
                                                                      item.id
                                                                  );
                                                              }}
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
            <CustomDialog
                open={state.delete.open}
                onClose={() => localDispatch(hideDialogDelete())}
                title="Do you want to delete this event?"
                actionName="Delete"
                onCancelClick={handleCancelClick}
                onActionClick={handleDeleteEventDetailById}
                bg="bg-red-400"
            />

            <CustomDialog
                open={state.updateStatus.open}
                onClose={() => localDispatch(hideDialogUpdateStatus())}
                title="Do you want to change status of this event?"
                actionName="Update Status"
                onCancelClick={() => localDispatch(hideDialogUpdateStatus())}
                onActionClick={handleDeleteEventDetailById}
                bg="bg-red-400"
            />
        </>
    );
}
