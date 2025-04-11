'use client';

import {
  Book,
  CalendarMonth,
  Festival,
  HolidayVillage,
  LocalFlorist,
  MusicNote,
  OutdoorGrill,
  Pool,
  SportsSoccer,
  SportsTennis,
  SportsVolleyball,
  Title,
} from '@mui/icons-material';
import {type SvgIconTypeMap, Tooltip} from '@mui/material';
import Badge from '@mui/material/Badge';
import type {OverridableComponent} from '@mui/material/OverridableComponent';
import {useQueryClient} from '@tanstack/react-query';
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';
import {
  Check as Done,
  Bell as Notifications,
  Pencil,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {startTransition, useCallback, useMemo, useState} from 'react';
import {deleteEventDetailById, updateEventStatus} from '~/app/actions/event';
import {getStudentEventsByStudentCode} from '~/app/actions/student';
import Dialog from '~/shared/components/legacy/dialog';
import DataTable from '~/shared/components/ui/data-table';
import StatusLabel from '~/shared/components/ui/status-label';
import {EventStatus, ScreenMode, UserRole} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {cn} from '~/shared/utils';
import type {IStudentDto} from '../types';

// Define types
type IStudentEventsDataTableProps = {
  rows: IStudentDto['events'];
  code: string;
  role?: string;
  username?: string;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  getQueryKey: () => (string | number)[];
};

type DataTableRow = IStudentDto['events'][number];
type DialogState = {open: boolean; id: number};

// Icon type definition
interface IIconType extends OverridableComponent<SvgIconTypeMap<{}, 'svg'>> {
  muiName: string;
}

// Icon mapping utility
const EVENT_ICON_MAP: Record<string, IIconType> = {
  swimming: Pool,
  soccer: SportsSoccer,
  event: CalendarMonth,
  volleyball: SportsVolleyball,
  reading: Book,
  badminton: SportsTennis,
  music: MusicNote,
  cooking: OutdoorGrill,
  calligraphy: Title,
  flower_arrangement: LocalFlorist,
  festival: Festival,
  camping: HolidayVillage,
};

const getEventIcon = (eventType: string) => {
  const IconComponent =
    EVENT_ICON_MAP[eventType.toLowerCase()] || CalendarMonth;
  return <IconComponent />;
};

export default function StudentEventsDataTable({
  rows,
  code,
  role,
  username,
  pagination,
  setPagination,
  getQueryKey,
}: IStudentEventsDataTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Use React's useReducer pattern through useState for dialog management
  const [deleteDialog, setDeleteDialog] = useState<DialogState>({
    open: false,
    id: -1,
  });
  const [statusDialog, setStatusDialog] = useState<DialogState>({
    open: false,
    id: -1,
  });

  // Memoized callback functions
  const refetchDataRows = useCallback(() => {
    startTransition(async () => {
      const res = await getStudentEventsByStudentCode(code);
      const data = res && Array.isArray(res.data) ? res.data : [];
      queryClient.setQueryData(getQueryKey(), data);
    });
  }, [code, queryClient, getQueryKey]);

  const getHref = useCallback(
    (id: number, screenMode: number) => {
      const params = new URLSearchParams();
      params.append('student_code', encodeURIComponent(code));
      params.append('mode', encodeURIComponent(screenMode));
      params.append('student_event_id', encodeURIComponent(id));
      return `/student-regist?${params.toString()}`;
    },
    [code],
  );

  // Dialog handlers
  const handleDone = useCallback(async () => {
    if (!username) return;

    await updateEventStatus({
      event_id: statusDialog.id,
      student_code: code,
    });

    refetchDataRows();
    setStatusDialog({open: false, id: -1});
  }, [statusDialog.id, code, username, refetchDataRows]);

  const handleDelete = useCallback(async () => {
    await deleteEventDetailById(deleteDialog.id);
    refetchDataRows();
    setDeleteDialog({open: false, id: -1});
  }, [deleteDialog.id, refetchDataRows]);

  // Action buttons based on role
  const renderActionButtons = useCallback(
    ({id, status}: {id: number; status: EventStatus}) => {
      if (!role) return null;

      const isConfirmed = status === EventStatus.CONFIRMED;

      if (role === UserRole.Counselor) {
        return (
          <Tooltip title={json.common.done}>
            <button
              onClick={() => setStatusDialog({open: true, id})}
              disabled={isConfirmed}>
              <Done
                size="2.25rem"
                stroke={
                  status !== EventStatus.CONFIRMED ? '#31bafd' : '#7d7e7e'
                }
                strokeWidth="0.225rem"
              />
            </button>
          </Tooltip>
        );
      }

      if (role === UserRole.Student) {
        return (
          <>
            <Tooltip title={json.common.edit}>
              <button
                className="cursor-pointer"
                onClick={() => router.push(getHref(id, ScreenMode.EDIT))}
                disabled={isConfirmed}>
                <Pencil
                  size="1.5rem"
                  className={cn(
                    'text-icon-default',
                    isConfirmed && 'text-[#7d7e7e]',
                  )}
                />
              </button>
            </Tooltip>
            <Tooltip title={json.common.delete}>
              <button
                className="cursor-pointer"
                disabled={isConfirmed}
                onClick={() => setDeleteDialog({open: true, id})}>
                <Trash2
                  size="1.5rem"
                  className={cn(
                    'text-red-500',
                    isConfirmed && 'text-[#7d7e7e]',
                  )}
                />
              </button>
            </Tooltip>
          </>
        );
      }

      if ([UserRole.Parent, UserRole.Teacher].includes(role)) {
        // Return default actions for parent/teacher if needed
        return null;
      }

      return null;
    },
    [role, router, getHref],
  );

  // Memoized columns definition
  const columns = useMemo<ColumnDef<DataTableRow>[]>(
    () => [
      {
        accessorKey: 'grade',
        header: 'クラス名',
        cell: ({row}) => <>{row.original.grade}</>,
      },
      {
        accessorKey: 'name',
        header: json.tableHeader.studentEvents.name,
        cell: ({row}) => (
          <div className="flex gap-x-2 items-center">
            <div className="text-blue-400">
              {getEventIcon(row.original.title)}
            </div>
            <div>{row.original.eventName}</div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: json.tableHeader.studentEvents.status,
        cell: ({row}) => <StatusLabel status={row.original.status} />,
      },
      {
        accessorKey: 'notifications',
        header: json.tableHeader.studentEvents.notification,
        cell: ({row}) => (
          <Link href={getHref(row.original.studentEventId, ScreenMode.CHAT)}>
            <Badge badgeContent={row.original.commentCount} color="error">
              <Notifications className="text-icon-default" size={24} />
            </Badge>
          </Link>
        ),
      },
      {
        accessorKey: 'actions',
        header: json.tableHeader.studentEvents.action,
        cell: ({row}) => (
          <div className="flex gap-x-6">
            {renderActionButtons({
              id: row.original.studentEventId,
              status: row.original.status,
            })}
          </div>
        ),
      },
    ],
    [getHref, renderActionButtons],
  );

  const MemoizedTable = useCallback(
    () => (
      <DataTable
        columns={columns}
        rows={rows}
        pagination={pagination}
        setPagination={setPagination}
      />
    ),
    [rows, pagination, setPagination, columns],
  );

  return (
    <>
      <MemoizedTable />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({open: false, id: -1})}
        title={json.dialog.delete.title}
        content={json.dialog.delete.content}
        onCancelClick={() => setDeleteDialog({open: false, id: -1})}
        onActionClick={handleDelete}
      />

      <Dialog
        open={statusDialog.open}
        onClose={() => setStatusDialog({open: false, id: -1})}
        title={json.dialog.update.title}
        content={json.dialog.update.content}
        onCancelClick={() => setStatusDialog({open: false, id: -1})}
        onActionClick={handleDone}
      />
    </>
  );
}
