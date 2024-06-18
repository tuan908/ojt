"use client";

import {deleteEventDetailById} from "@/app/actions/event.action";
import {updateEventStatus} from "@/app/actions/student.action";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import {StatusLabel} from "@/components/StatusLabel";
import TableCell from "@/components/TableCell";
import TableHead from "@/components/TableHead";
import TableRow from "@/components/TableRow";
import {Delete, Done, Edit} from "@/components/icon";
import {EventStatus, ScreenMode, UserRole} from "@/constants";
import {useAuth} from "@/hooks/useAuth";
import {hideLoading, showLoading} from "@/redux/features/loading/loading.slice";
import {useAppDispatch} from "@/redux/hooks";
import type {StudentEventResponse} from "@/types/student.types";
import Utils from "@/utils";
import Notifications from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import {createAction, createReducer} from "@reduxjs/toolkit";
import Link from "next/link";
import {useCallback, useEffect, useReducer, useState} from "react";

interface DialogState {
    open: boolean;
    id: number;
}

interface LocalState {
    delete: DialogState;
    updateStatus: DialogState;
    isUpdating: boolean;
}

type EventGridProps = {
    data: StudentEventResponse["events"];
    studentId?: number;
    code: string;
};

const openDialogDelete = createAction<number>("MODAL_DELETE/OPEN");
const openDialogUpdateStatus = createAction<number>("MODAL_UPDATE_STATUS/OPEN");

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
            state.delete.id = action.payload;
        })
        .addCase(hideDialogDelete, state => {
            state.delete.open = false;
            state.delete.id = -1;
        })
        .addCase(openDialogUpdateStatus, (state, action) => {
            state.updateStatus.open = true;
            state.updateStatus.id = action.payload;
        })
        .addCase(hideDialogUpdateStatus, state => {
            state.updateStatus.open = false;
            state.updateStatus.id = -1;
        });
});

export default function EventGrid(props: EventGridProps) {
    const {data, studentId, code} = props;
    const {auth} = useAuth();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [rows, setRows] = useState<StudentEventResponse["events"]>(data);
    const appDispatch = useAppDispatch();

    useEffect(() => setRows(data), [data]);

    async function handleDone() {
        dispatch(hideDialogUpdateStatus());
        await appDispatch(showLoading());
        await updateEventStatus({
            id: state.updateStatus.id,
            studentId: studentId!,
            updatedBy: auth?.username!,
        });
        await appDispatch(hideLoading());
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
        dispatch(openDialogDelete(id));
    };

    const handleOpenUpdateStatusDialog = (id: number) => {
        dispatch(openDialogUpdateStatus(id));
    };

    const getHref = useCallback((id: number) => {
        return `/events?id=${id}&mode=${ScreenMode.CHAT}`;
    }, []);

    return (
        <>
            <table className="w-full border border-table border-collapse align-middle">
                <thead>
                    <tr className="bg-[#3f51b5] text-[#fffffc]">
                        <TableHead>クラス名</TableHead>
                        <TableHead>イベント</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>通知</TableHead>
                        {[
                            UserRole.Student.toString(),
                            UserRole.Counselor.toString(),
                        ].indexOf(auth?.role!) > -1 ? (
                            <TableHead>アクション</TableHead>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    <>
                        {rows!?.map(item => (
                            <TableRow key={item.id}>
                                <TableCell textCenter>{item?.grade}</TableCell>
                                <TableCell textCenter>{item?.name}</TableCell>
                                <TableCell textCenter>
                                    <StatusLabel status={item?.status} />
                                </TableCell>
                                <TableCell fontSemibold textEllipsis textCenter>
                                    <Link href={getHref(item.id)}>
                                        <Badge
                                            badgeContent={item.comments}
                                            color="error"
                                        >
                                            <Notifications
                                                className="text-icon-default"
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        </Badge>
                                    </Link>
                                </TableCell>
                                <TableCell fontSemibold textEllipsis>
                                    <div className="w-full flex justify-center items-center gap-x-6">
                                        {auth?.role! === UserRole.Counselor ? (
                                            <Button
                                                onClick={() =>
                                                    handleOpenUpdateStatusDialog(
                                                        item.id
                                                    )
                                                }
                                                disabled={
                                                    item?.status ===
                                                    EventStatus.CONFIRMED
                                                }
                                            >
                                                <Done
                                                    isDone={
                                                        item?.status ===
                                                        EventStatus.CONFIRMED
                                                    }
                                                />
                                            </Button>
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/events?id=${item.id}&mode=${ScreenMode.EDIT}`}
                                                    className={Utils.cn(
                                                        item.status ===
                                                            EventStatus.CONFIRMED &&
                                                            "pointer-events-none"
                                                    )}
                                                >
                                                    <Edit
                                                        disabled={
                                                            item.status ===
                                                            EventStatus.CONFIRMED
                                                        }
                                                    />
                                                </Link>
                                                <Button
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
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </>
                </tbody>
            </table>
            <Dialog
                open={state.delete.open}
                onClose={() => dispatch(hideDialogDelete())}
                title="Delete Event"
                contentText="Do you want to delete this event?"
                actionButtonText="Delete"
                onCancelClick={() => dispatch(hideDialogDelete())}
                onActionClick={handleDeleteEventDetailById}
                actionButtonBackgroundColor="bg-red-400"
            />

            <Dialog
                open={state.updateStatus.open}
                onClose={() => dispatch(hideDialogUpdateStatus())}
                title="Update Status"
                contentText="Do you want to change status of this event?"
                actionButtonText="Update"
                onCancelClick={() => dispatch(hideDialogUpdateStatus())}
                onActionClick={handleDone}
                actionButtonBackgroundColor="bg-blue-400"
            />
        </>
    );
}
