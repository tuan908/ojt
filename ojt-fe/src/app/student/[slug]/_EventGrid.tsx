"use client";

import {deleteEventDetailById} from "@/app/actions/event";
import {updateEventStatus} from "@/app/actions/student";
import ButtonBase from "@/components/ButtonBase";
import CustomDialog from "@/components/CustomDialog";
import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import {Delete, Done, Edit} from "@/components/icon";
import {EventStatus, ScreenMode, UserRole} from "@/constants";
import {useAuth} from "@/lib/hooks/useAuth";
import {type StudentResponseDto} from "@/types/student.types";
import Notifications from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import {createAction, createReducer} from "@reduxjs/toolkit";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useReducer, useState, type SyntheticEvent} from "react";
import {StatusLabel} from "./_StatusLabel";

interface DialogState {
    open: boolean;
    id: number;
}

interface LocalState {
    delete: DialogState;
    updateStatus: DialogState;
    isUpdating: boolean;
}

const openDialogDelete = createAction<{id: number}>("MODAL_DELETE/OPEN");
const openDialogUpdateStatus = createAction<{id: number}>(
    "MODAL_UPDATE_STATUS/OPEN"
);

const hideDialogDelete = createAction("MODAL_DELETE/HIDE");
const hideDialogUpdateStatus = createAction("MODAL_UPDATE_STATUS/HIDE");

const setIsUpdating = createAction<boolean>("STATE_UPDATING");

const initialState: LocalState = {
    delete: {
        open: false,
        id: -1,
    },
    updateStatus: {
        open: false,
        id: -1,
    },
    isUpdating: false,
};

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(openDialogDelete, (state, action) => {
            state.delete.open = true;
            state.delete.id = action.payload.id;
        })
        .addCase(hideDialogDelete, state => {
            state.delete.open = false;
            state.delete.id = -1;
        })
        .addCase(openDialogUpdateStatus, (state, action) => {
            state.updateStatus.open = true;
            state.updateStatus.id = action.payload.id;
        })
        .addCase(hideDialogUpdateStatus, state => {
            state.updateStatus.open = false;
            state.updateStatus.id = -1;
        });
});

export function EventGrid({
    data,
    studentId,
    code,
}: {
    data: StudentResponseDto["events"];
    studentId?: number;
    code: string;
}) {
    const {auth} = useAuth();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [rows, setRows] = useState<StudentResponseDto["events"]>(data);

    useEffect(() => setRows(data), [data]);

    const router = useRouter();

    async function handleDone(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
        id: number
    ) {
        event.preventDefault();
        const actionResponse = await updateEventStatus({
            id,
            studentId: studentId!,
            updatedBy: auth?.username!,
        });
        dispatch(hideDialogUpdateStatus());
    }

    function handleNotificationIconClick(
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>,
        id: number
    ) {
        event?.preventDefault();
        let url = `/event?id=${id}&mode=${ScreenMode.CHAT}`;
        router.push(url);
    }

    function handleDeleteEventDetailById(): void {
        dispatch(setIsUpdating(true));
        deleteEventDetailById(code, state.delete.id)
            .then(res => setRows(res ?? []))
            .finally(() => {
                dispatch(setIsUpdating(false));
                dispatch(hideDialogDelete());
            });
    }

    const handleOpenDeleteDialog = (id: number) => {
        dispatch(
            openDialogDelete({
                id,
            })
        );
    };

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
                    {state.isUpdating ? (
                        <CircularProgress color="info" />
                    ) : (
                        <>
                            {rows!?.map(item => (
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
                                                            dispatch(
                                                                openDialogUpdateStatus(
                                                                    {
                                                                        id: item.id,
                                                                    }
                                                                )
                                                            )
                                                        }
                                                        disabled={
                                                            item?.status ===
                                                            EventStatus.CONFIRMED
                                                        }
                                                    >
                                                        <Done
                                                            isDone={
                                                                item?.status !==
                                                                EventStatus.CONFIRMED
                                                            }
                                                        />
                                                    </ButtonBase>
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={`/event?id=${item.id}&mode=${ScreenMode.EDIT}`}
                                                        >
                                                            <Edit
                                                                disabled={
                                                                    item.status ===
                                                                    EventStatus.CONFIRMED
                                                                }
                                                            />
                                                        </Link>
                                                        <ButtonBase
                                                            disabled={
                                                                item.status ===
                                                                EventStatus.CONFIRMED
                                                            }
                                                            onClick={() =>
                                                                handleOpenDeleteDialog(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <Delete
                                                                disabled={
                                                                    item.status ===
                                                                    EventStatus.CONFIRMED
                                                                }
                                                            />
                                                        </ButtonBase>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
            <CustomDialog
                open={state.delete.open}
                onClose={() => dispatch(hideDialogDelete())}
                title="Do you want to delete this event?"
                actionName="Delete"
                onCancelClick={() => dispatch(hideDialogDelete())}
                onActionClick={handleDeleteEventDetailById}
                bg="bg-red-400"
            />

            <CustomDialog
                open={state.updateStatus.open}
                onClose={() => dispatch(hideDialogUpdateStatus())}
                title="Do you want to change status of this event?"
                actionName="Update Status"
                onCancelClick={() => dispatch(hideDialogUpdateStatus())}
                onActionClick={handleDeleteEventDetailById}
                bg="bg-red-400"
            />
        </>
    );
}
