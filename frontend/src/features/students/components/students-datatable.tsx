'use client';

import {Tooltip} from '@mui/material';
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table';
import {ChartNoAxesCombined} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {
  MouseEvent,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react';
import TextHashtag from '~/features/students/components/text-hashtag';
import {Button} from '~/shared/components/ui/button';
import DataTable from '~/shared/components/ui/data-table';
import json from '~/shared/i18n/locales/ja.json';
import type {IStudentsDto} from '~/shared/types';

interface IStudentsDataTableProps {
  rows: IStudentsDto[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}

export default function StudentsDataTable({
  rows,
  pagination,
  setPagination,
}: IStudentsDataTableProps) {
  const router = useRouter();

  const [actualRows, setRows] = useState<IStudentsDto[]>([]);

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  const handleRowClick = (studentCode?: string) => {
    if (!studentCode) return;
    startTransition(() => {
      router.push(`/students/${studentCode}`);
    });
  };

  const handleCellClick = (event: MouseEvent, studentCode?: string) => {
    event.stopPropagation();
    if (!studentCode) return;
    startTransition(() => {
      router.push(`/trackings?student_code=${encodeURIComponent(studentCode)}`);
    });
  };

  const columns: ColumnDef<IStudentsDto>[] = [
    {
      accessorKey: 'code',
      header: json.tableHeader.event.code,
      cell: ({row}) => <>{row.original.code}</>,
    },
    {
      accessorKey: 'name',
      header: json.tableHeader.event.name,
      cell: ({row}) => <>{row.original.name}</>,
    },
    {
      accessorKey: 'grade',
      header: json.tableHeader.event.grade,
      cell: ({row}) => <>{row.original.grade}</>,
    },
    {
      accessorKey: 'events',
      header: json.tableHeader.event.events,
      cell: ({row}) => (
        <div className="px-2 font-semibold truncate">{row.original.events}</div>
      ),
    },
    {
      accessorKey: 'hashtags',
      header: json.tableHeader.event.hashtags,
      cell: ({row}) => (
        <div className="flex gap-1">
          {row.original.hashtags?.map((hashtag, index) => (
            <TextHashtag
              key={`${hashtag.id}#${index}`}
              color={hashtag.color}
              px={0.25}>
              {hashtag.name}
            </TextHashtag>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'tracking',
      header: json.tableHeader.event.tracking,
      cell: ({row}) => (
        <>
          <Tooltip title={json.common.viewStatistics}>
            <Button
              className="cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={event => handleCellClick(event, row.original.code)}>
              <ChartNoAxesCombined className="w-5 h-5 text-icon-default" />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const MemoizedDataTable = useCallback(
    () => (
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        rows={actualRows}
        onRowClick={row => handleRowClick(row.code)}
      />
    ),
    [pagination, setPagination, columns, actualRows],
  );

  return (
    <div className="w-full px-12">
      <MemoizedDataTable />
    </div>
  );
}
