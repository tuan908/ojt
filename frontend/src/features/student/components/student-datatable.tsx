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
import {startTransition, useEffect, useMemo, useState} from 'react';
import {deleteEventDetailById, updateEventStatus} from '~/app/actions/event';
import {getStudentEventsByStudentCode} from '~/app/actions/student';
import Dialog from '~/shared/components/legacy/dialog';
import DataTable from '~/shared/components/ui/data-table';
import StatusLabel from '~/shared/components/ui/status-label';
import {EventStatus, ScreenMode, UserRole} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {cn} from '~/shared/utils';
import type {IStudentDto} from '../types';

type StudentEventsDatatableProps = {
  rows: IStudentDto['events'];
  code: string;
  role?: string;
  username?: string;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
};

type InternalStudentEventsDatatableProps = IStudentDto['events'][number];

export default function StudentEventsDatatable({
  rows,
  code,
  role,
  username,
  pagination,
  setPagination,
}: StudentEventsDatatableProps) {
  const router = useRouter();
  const [dialogs, setDialogs] = useState({
    delete: {open: false, id: -1},
    updateStatus: {open: false, id: -1},
  });

  const [actualRows, setActualRows] = useState<IStudentDto['events']>([]);

  useEffect(() => {
    setActualRows(rows);
  }, [rows]);

  const columns: ColumnDef<InternalStudentEventsDatatableProps>[] = useMemo(
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
        cell: ({row}) => (
          <>
            <StatusLabel status={row.original.status} />
          </>
        ),
      },
      {
        accessorKey: 'notifications',
        header: json.tableHeader.studentEvents.notification,
        cell: ({row}) => (
          <>
            <Link href={getHref(row.original.studentEventId, ScreenMode.CHAT)}>
              <Badge badgeContent={row.original.commentCount} color="error">
                <Notifications className="text-icon-default" size={24} />
              </Badge>
            </Link>
          </>
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
    [],
  );

  // Open dialog functions
  const openDeleteDialog = (id: number) =>
    setDialogs(prev => ({...prev, delete: {open: true, id}}));
  const openUpdateStatusDialog = (id: number) =>
    setDialogs(prev => ({...prev, updateStatus: {open: true, id}}));

  // Close dialog functions
  const closeDeleteDialog = () =>
    setDialogs(prev => ({...prev, delete: {open: false, id: -1}}));
  const closeUpdateStatusDialog = () =>
    setDialogs(prev => ({
      ...prev,
      updateStatus: {open: false, id: -1},
    }));

  function handleDone() {
    try {
      startTransition(async () => {
        await updateEventStatus({
          event_id: dialogs.updateStatus.id,
          student_code: code,
          updated_by: username!,
        });
        await getStudentEventsByStudentCode(code);
      });
    } catch (error) {
      console.error('Error while updating status');
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
    const params = new URLSearchParams();
    params.append('student_code', encodeURIComponent(code));
    params.append('mode', encodeURIComponent(screenMode));
    params.append('student_event_id', encodeURIComponent(id));

    return `/student-regist?${params.toString()}`;
  };

  const renderActionButtons = (item: {id: number; status: EventStatus}) => {
    if (role && role !== UserRole.Student) {
      return (
        <Tooltip title={json.common.done}>
          <button
            onClick={() => openUpdateStatusDialog(item.id)}
            disabled={item?.status === EventStatus.CONFIRMED}>
            <Done
              size="1.5rem"
              stroke={
                item.status === EventStatus.CONFIRMED ? '#31bafd' : '#7d7e7e'
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
            onClick={() => router.push(getHref(item.id, ScreenMode.EDIT))}>
            <Pencil
              size="1.5rem"
              className={cn(
                'text-icon-default',
                item.status === EventStatus.CONFIRMED && 'text-[#7d7e7e]',
              )}
            />
          </button>
        </Tooltip>
        <Tooltip title={json.common.delete}>
          <button
            className="cursor-pointer"
            disabled={item.status === EventStatus.CONFIRMED}
            onClick={() => openDeleteDialog(item.id)}>
            <Trash2
              size="1.5rem"
              className={cn(
                'text-red-500',
                item.status === EventStatus.CONFIRMED && 'text-[#7d7e7e]',
              )}
            />
          </button>
        </Tooltip>
      </>
    );
  };

  return (
    <>
      <DataTable
        key={actualRows.length}
        columns={columns}
        rows={actualRows}
        pagination={pagination}
        setPagination={setPagination}
      />

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

interface IIconType extends OverridableComponent<SvgIconTypeMap<{}, 'svg'>> {
  muiName: string;
}

const getEventIcon = (eventType: string) => {
  const iconMap: Record<string, IIconType> = {
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
    // Add more mappings as needed
  };

  const IconComponent = iconMap[eventType.toLowerCase()] || CalendarMonth;
  return <IconComponent />;
};
