"use client";

import { deleteEventDetailById, updateEventStatus } from "@/app/actions/event";
import { getStudentByCode } from "@/app/actions/student";
import DataTable from "@/shared/components/data-table";
import Dialog from "@/shared/components/legacy/dialog";
import StatusLabel from "@/shared/components/status-label";
import { EventStatus, ScreenMode, UserRole } from "@/shared/constants";
import json from "@/shared/i18n/locales/ja.json";
import { cn } from "@/shared/utils";
import { Tooltip } from "@mui/material";
import Badge from "@mui/material/Badge";
import { ColumnDef } from "@tanstack/react-table";
import {
    Check as Done,
    Bell as Notifications,
    Pencil,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { StudentDto } from "../types";

type StudentEventsDatatableProps = {
    rows: StudentDto["events"];
    studentId?: number;
    code: string;
    role?: string;
    username?: string;
};

type InternalStudentEventsDatatableProps = StudentDto["events"][number];

export default function StudentEventsDatatable({
    rows,
    studentId,
    code,
    role,
    username,
}: StudentEventsDatatableProps) {
    const router = useRouter();
    const [dialogs, setDialogs] = useState({
        delete: { open: false, id: -1 },
        updateStatus: { open: false, id: -1 },
    });

    const columns: ColumnDef<InternalStudentEventsDatatableProps>[] = useMemo(
        () => [
            {
                accessorKey: "grade",
                header: "クラス名",
                cell: ({ row }) => <>{row.original.grade}</>,
            },
            {
                accessorKey: "name",
                header: json.tableHeader.studentEvents.name,
                cell: ({ row }) => <>{row.original.eventName}</>,
            },
            {
                accessorKey: "status",
                header: json.tableHeader.studentEvents.status,
                cell: ({ row }) => (
                    <>
                        <StatusLabel status={row.original.status} />
                    </>
                ),
            },
            {
                accessorKey: "notifications",
                header: json.tableHeader.studentEvents.notification,
                cell: ({ row }) => (
                    <>
                        <Link href={getHref(row.original.studentEventId, ScreenMode.CHAT)}>
                            <Badge
                                badgeContent={row.original.commentCount}
                                color="error"
                            >
                                <Notifications
                                    className="text-icon-default"
                                    size={24}
                                />
                            </Badge>
                        </Link>
                    </>
                ),
            },
            {
                accessorKey: "actions",
                header: json.tableHeader.studentEvents.action,
                cell: ({ row }) => (
                    <div className="flex gap-x-6">
                        {renderActionButtons({id: row.original.studentEventId, status: row.original.status})}
                    </div>
                ),
            },
        ],
        []
    );

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

    function handleDone() {
        try {
            startTransition(async () => {
                await updateEventStatus({
                    id: dialogs.updateStatus.id,
                    studentId: studentId!,
                    updatedBy: username!,
                });
                await getStudentByCode(code);
            });
        } catch (error) {
            console.error("Error while updating status");
        }
        closeUpdateStatusDialog();
    }

    function handleDeleteEventDetailById(): void {
        startTransition(async () => {
            await deleteEventDetailById(dialogs.delete.id);
        });
        closeDeleteDialog();
    }

    const getHref = (id: number, screenMode: number) => {
        return `/students/${encodeURIComponent(code)}/events?eventId=${encodeURIComponent(id)}&mode=${encodeURIComponent(screenMode)}`;
    };

    const renderActionButtons = (item: { id: number; status: EventStatus }) => {
        if (role && role !== UserRole.Student) {
            return (
                <Tooltip title={json.common.done}>
                    <button
                        onClick={() => openUpdateStatusDialog(item.id)}
                        disabled={item?.status === EventStatus.CONFIRMED}
                    >
                        <Done
                            size="1.5rem"
                            stroke={
                                item.status === EventStatus.CONFIRMED
                                    ? "#31bafd"
                                    : "#7d7e7e"
                            }
                        />
                    </button>
                </Tooltip>
            );
        }

        return (
            <>
                <Tooltip title={json.common.edit}>
                    <button
                        className="cursor-pointer"
                        onClick={() =>
                            router.push(getHref(item.id, ScreenMode.EDIT))
                        }
                    >
                        <Pencil
                            size="1.5rem"
                            className={cn(
                                "text-icon-default",
                                item.status === EventStatus.CONFIRMED &&
                                    "text-[#7d7e7e]"
                            )}
                        />
                    </button>
                </Tooltip>
                <Tooltip title={json.common.delete}>
                    <button
                        className="cursor-pointer"
                        disabled={item.status === EventStatus.CONFIRMED}
                        onClick={() => openDeleteDialog(item.id)}
                    >
                        <Trash2
                            size="1.5rem"
                            className={cn(
                                "text-red-500",
                                item.status === EventStatus.CONFIRMED &&
                                    "text-[#7d7e7e]"
                            )}
                        />
                    </button>
                </Tooltip>
            </>
        );
    };

    console.log(rows);

    return (
        <>
            <DataTable columns={columns} rows={rows} />

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
