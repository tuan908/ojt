"use client";

import { deleteEventDetailById } from "@/app/actions/event";
import { getStudentByCode, updateEventStatus } from "@/app/actions/student";
import Dialog from "@/components/Dialog";
import StatusLabel from "@/components/StatusLabel";
import { Delete, Done, Edit } from "@/components/icon";
import { DataTable } from "@/components/ui/data-table";
import { EventStatus, ScreenMode, UserRole } from "@/constants";
import json from "@/i18n/jp.json";
import type { StudentEvent } from "@/types/student";
import { Tooltip } from "@mui/material";
import Badge from "@mui/material/Badge";
import { ColumnDef } from "@tanstack/react-table";
import { Bell as Notifications } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";

type StudentEventsDatatableProps = {
    data: StudentEvent["events"];
    studentId?: number;
    code: string;
    role?: string;
    username?: string;
};

type InternalStudentEventsDatatableProps = StudentEvent["events"][number];

export default function StudentEventsDatatable({
    data,
    studentId,
    code,
    role,
    username,
}: StudentEventsDatatableProps) {
    const router = useRouter();
    const [rows, setRows] = useState<StudentEvent["events"]>([]);
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
                header: json.table.header.studentEvents.name,
                cell: ({ row }) => <>{row.original.name}</>,
            },
            {
                accessorKey: "status",
                header: json.table.header.studentEvents.status,
                cell: ({ row }) => (
                    <>
                        <StatusLabel status={row.original.status} />
                    </>
                ),
            },
            {
                accessorKey: "notifications",
                header: json.table.header.studentEvents.notification,
                cell: ({ row }) => (
                    <>
                        <Link href={getHref(row.original.id, ScreenMode.CHAT)}>
                            <Badge
                                badgeContent={row.original.comments?.length}
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
                header: json.table.header.studentEvents.action,
                cell: ({ row }) => (
                    <div className="flex gap-x-6">
                        {renderActionButtons(row.original)}
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

    useEffect(() => setRows(data), [data]);

    function handleDone() {
        try {
            startTransition(async () => {
                await updateEventStatus({
                    id: dialogs.updateStatus.id,
                    studentId: studentId!,
                    updatedBy: username!,
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

    const getHref = (id: number, screenMode: number) => {
        return `/students/${code}/events/${id}?mode=${screenMode}`;
    };

    const renderActionButtons = (item: { id: number; status: EventStatus }) => {
        if (role && role !== UserRole.Student) {
            return (
                <Tooltip title={json.common.done}>
                    <button
                        onClick={() => openUpdateStatusDialog(item.id)}
                        disabled={item?.status === EventStatus.CONFIRMED}
                    >
                        <Done isDone={item?.status === EventStatus.CONFIRMED} />
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
                        <Edit
                            disabled={item.status === EventStatus.CONFIRMED}
                        />
                    </button>
                </Tooltip>
                <Tooltip title={json.common.delete}>
                    <button
                        className="cursor-pointer"
                        disabled={item.status === EventStatus.CONFIRMED}
                        onClick={() => openDeleteDialog(item.id)}
                    >
                        <Delete
                            disabled={item.status === EventStatus.CONFIRMED}
                        />
                    </button>
                </Tooltip>
            </>
        );
    };

    return (
        <>
            <DataTable columns={columns} data={data} />

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
