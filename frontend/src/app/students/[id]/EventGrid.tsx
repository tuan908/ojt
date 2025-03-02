"use client";

import { deleteEventDetailById } from "@/app/actions/event.action";
import {
    getStudentByCode,
    updateEventStatus,
} from "@/app/actions/student.action";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import ProgressIndicator from "@/components/ProgressIndicator";
import StatusLabel from "@/components/StatusLabel";
import TableCell from "@/components/Table/TableCell";
import TableHead from "@/components/Table/TableHead";
import TableRow from "@/components/Table/TableRow";
import { Delete, Done, Edit } from "@/components/icon";
import { EventStatus, ScreenMode, UserRole } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import json from "@/i18n/jp.json";
import type { StudentEvent } from "@/types/student";
import Notifications from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";

type EventGridProps = {
    data: StudentEvent["events"];
    studentId?: number;
    code: string;
};

export default function EventGrid({ data, studentId, code }: EventGridProps) {
    const { auth } = useAuth();
    const [rows, setRows] = useState<StudentEvent["events"]>([]);
    const [isPending, startTransition] = useTransition();
    const [dialogs, setDialogs] = useState({
        delete: { open: false, id: -1 },
        updateStatus: { open: false, id: -1 },
    });

    // Open dialog functions
    const openDeleteDialog = (id: number) =>
        setDialogs(prev => ({ ...prev, delete: { open: true, id } }));
    const openUpdateStatusDialog = (id: number) =>
        setDialogs(prev => ({ ...prev, updateStatus: { open: true, id } }));

    // Close dialog functions
    const closeDeleteDialog = () =>
        setDialogs(prev => ({ ...prev, delete: { open: false, id: -1 } }));
    const closeUpdateStatusDialog = () =>
        setDialogs(prev => ({
            ...prev,
            updateStatus: { open: false, id: -1 },
        }));

    useEffect(() => setRows(data), [data]);

    function handleDone() {
        try {
            startTransition(async () => {
                await updateEventStatus({
                    id: dialogs.updateStatus.id,
                    studentId: studentId!,
                    updatedBy: auth?.username!,
                });
                const data = await getStudentByCode(code);
                setRows(data!?.events);
            });
        } catch (error) {
            console.error("Error while updating status");
        }
        closeUpdateStatusDialog();
    }

    function handleDeleteEventDetailById(): void {
        startTransition(async () => {
            const data = await deleteEventDetailById(code, dialogs.delete.id);
            setRows(data!);
        });
        closeDeleteDialog();
    }

    const getHref = useCallback(
        (id: number, screenMode: number) => {
            return `/students/${code}/events/${id}?mode=${screenMode}`;
        },
        [code]
    );

    const isActionColumnActive = useMemo(() => {
        return (
            auth?.role === UserRole.Student || auth?.role === UserRole.Counselor
        );
    }, [auth?.role]);

    const renderActionButtons = (item: { id: number; status: EventStatus }) => {
        if (auth?.role === UserRole.Counselor) {
            return (
                <Button
                    onClick={() => openUpdateStatusDialog(item.id)}
                    disabled={item?.status === EventStatus.CONFIRMED}
                >
                    <Done isDone={item?.status === EventStatus.CONFIRMED} />
                </Button>
            );
        }

        return (
            <>
                <Link href={getHref(item.id, ScreenMode.EDIT)}>
                    <Edit disabled={item.status === EventStatus.CONFIRMED} />
                </Link>
                <Button
                    disabled={item.status === EventStatus.CONFIRMED}
                    onClick={() => openDeleteDialog(item.id)}
                >
                    <Delete disabled={item.status === EventStatus.CONFIRMED} />
                </Button>
            </>
        );
    };

    return (
        <>
            <table className="w-full border border-table border-collapse align-middle">
                <thead>
                    <tr className="bg-[#3f51b5] text-[#fffffc]">
                        <TableHead>クラス名</TableHead>
                        <TableHead>イベント</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>通知</TableHead>
                        {!isActionColumnActive ? null : (
                            <TableHead>アクション</TableHead>
                        )}
                    </tr>
                </thead>
                <tbody className="relative">
                    <>
                        {isPending && (
                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#454545] opacity-30 flex items-center justify-center">
                                <ProgressIndicator />
                            </div>
                        )}
                        {rows!?.map(item => (
                            <TableRow key={item.id}>
                                <TableCell textCenter>{item?.grade}</TableCell>
                                <TableCell textCenter>{item?.name}</TableCell>
                                <TableCell textCenter>
                                    <StatusLabel status={item?.status} />
                                </TableCell>
                                <TableCell fontSemibold textEllipsis textCenter>
                                    <Link
                                        href={getHref(item.id, ScreenMode.CHAT)}
                                    >
                                        <Badge
                                            badgeContent={
                                                item.comments!?.length
                                            }
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
                                {!isActionColumnActive ? null : (
                                    <TableCell fontSemibold textEllipsis>
                                        <div className="w-full flex justify-center items-center gap-x-6">
                                            {renderActionButtons(item)}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </>
                </tbody>
            </table>

            <Dialog
                open={dialogs.delete.open}
                onClose={() => closeDeleteDialog()}
                title={json.dialog.delete.title}
                content={json.dialog.delete.content}
                onCancelClick={() => closeDeleteDialog()}
                onActionClick={handleDeleteEventDetailById}
                buttonColor="danger"
            />

            <Dialog
                open={dialogs.updateStatus.open}
                onClose={() => closeUpdateStatusDialog()}
                title={json.dialog.update.title}
                content={json.dialog.update.content}
                onCancelClick={() => closeUpdateStatusDialog()}
                onActionClick={handleDone}
                buttonColor="info"
            />
        </>
    );
}
