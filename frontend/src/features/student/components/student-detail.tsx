'use client';

import {Tooltip} from '@mui/material';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {PaginationState} from '@tanstack/react-table';
import {Search} from 'lucide-react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useCallback, useMemo, useState, type ChangeEventHandler} from 'react';
import {getStudentEventsByStudentCode} from '~/app/actions/student';
import {Checkbox} from '~/shared/components/legacy/checkbox';
import LegacySelect from '~/shared/components/legacy/select';
import {EventStatus, QUERY_KEY} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import type {IEventDto, IGradeDto} from '~/shared/types';
import {tryCatch} from '~/shared/utils';
import StudentEventsDataTable from './student-datatable';

interface IStudentDetailProps {
  code: string;
  grades: IGradeDto[];
  events: IEventDto[];
  role: string;
  username?: string;
}

type StatusKey = 'unconfirmed' | 'under_reviewing' | 'confirmed';

interface ICheckboxState {
  unconfirmed: boolean;
  under_reviewing: boolean;
  confirmed: boolean;
}

const STATUS_MAP: Record<StatusKey, EventStatus> = {
  unconfirmed: EventStatus.UNCONFIRMED,
  under_reviewing: EventStatus.UNDER_REVIEWING,
  confirmed: EventStatus.CONFIRMED,
};

const INIT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

export default function StudentDetail({
  code,
  events,
  grades,
  role,
  username,
}: IStudentDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize filter states from URL
  const [filterState, setFilterState] = useState({
    grade: searchParams.get('grade') || '',
    eventName: searchParams.get('event') || '',
    statusFilters: initStatusFilters(searchParams.get('status')),
  });

  const [pagination, setPagination] =
    useState<PaginationState>(INIT_PAGINATION);

  // Create memoized query key for consistency
  const getQueryKey = useCallback(() => {
    return [QUERY_KEY.EVENT, code, pagination.pageIndex, pagination.pageSize];
  }, [code, pagination.pageIndex, pagination.pageSize]);

  // Convert checkbox state to status array
  const statusArray = useMemo(() => {
    return Object.entries(filterState.statusFilters)
      .filter(([_, checked]) => checked)
      .map(([key]) => STATUS_MAP[key as StatusKey]);
  }, [filterState.statusFilters]);

  // Handle checkbox changes
  const handleStatusChange: ChangeEventHandler<HTMLInputElement> = event => {
    const {name, checked} = event.target;
    setFilterState(prev => ({
      ...prev,
      statusFilters: {
        ...prev.statusFilters,
        [name]: checked,
      },
    }));
  };

  // Handle dropdown changes
  const handleGradeChange = (value: string) => {
    setFilterState(prev => ({...prev, grade: value}));
  };

  const handleEventChange = (value: string) => {
    setFilterState(prev => ({...prev, eventName: value}));
  };

  // Data fetching with React Query
  const {data: rows = []} = useQuery({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const res = await getStudentEventsByStudentCode(code, {
        grade: filterState.grade,
        eventName: filterState.eventName,
        status: statusArray,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

      return res?.data || [];
    },
  });

  // Search function that updates URL and refetches data
  const handleSearch = useCallback(async () => {
    const params = new URLSearchParams();

    if (filterState.grade) {
      params.set('grade', filterState.grade);
    }

    if (filterState.eventName) {
      params.set('event', filterState.eventName);
    }

    if (statusArray.length > 0) {
      params.set('status', statusArray.join(','));
    }

    // Fetch data with current filters
    const studentPromise = getStudentEventsByStudentCode(code, {
      grade: filterState.grade,
      eventName: filterState.eventName,
      status: statusArray,
    });

    const {data: result} = await tryCatch(studentPromise);
    const events = result && Array.isArray(result?.data) ? result.data : [];

    // Update cache
    queryClient.setQueryData(getQueryKey(), events);

    // Update URL
    const search = params.toString();
    const url = search ? `${pathname}?${search}` : pathname;
    router.push(url);
  }, [
    code,
    filterState,
    statusArray,
    queryClient,
    getQueryKey,
    pathname,
    router,
  ]);

  return (
    <>
      <div className="border-b md:px-8 px-4 flex flex-col gap-y-4 md:flex-row md:items-center py-4 md:gap-x-8">
        {/* Grade/Class filter */}
        <LegacySelect
          name="grade"
          label={json.label.grade}
          options={grades || []}
          value={filterState.grade}
          onChange={e => handleGradeChange(e.target.value)}
        />

        {/* Event filter */}
        <LegacySelect
          name="event"
          label={json.label.event}
          options={events || []}
          value={filterState.eventName}
          onChange={e => handleEventChange(e.target.value)}
        />

        {/* Status filters */}
        <div className="flex flex-col items-center md:flex-row md:gap-x-8">
          <span>ステータス：</span>

          {/* Unconfirmed */}
          <Checkbox
            label={json.status.unconfirmed}
            name="unconfirmed"
            checked={filterState.statusFilters.unconfirmed}
            handleChange={handleStatusChange}
          />

          {/* Under review */}
          <Checkbox
            label={json.status.underReviewing}
            name="under_reviewing"
            checked={filterState.statusFilters.under_reviewing}
            handleChange={handleStatusChange}
          />

          {/* Confirmed */}
          <Checkbox
            label={json.status.confirmed}
            name="confirmed"
            checked={filterState.statusFilters.confirmed}
            handleChange={handleStatusChange}
          />
        </div>

        {/* Search button */}
        <Tooltip title={json.common.search}>
          <button
            className="border-none outline-none flex items-center justify-center cursor-pointer"
            onClick={handleSearch}
            aria-label="Search">
            <Search className="text-icon-default" size="1.5rem" />
          </button>
        </Tooltip>
      </div>

      {/* Data table */}
      <div className="w-full px-10 pt-6">
        <StudentEventsDataTable
          rows={rows}
          code={code}
          role={role}
          username={username}
          pagination={pagination}
          setPagination={setPagination}
          getQueryKey={getQueryKey}
        />
      </div>
    </>
  );
}

// Helper function to initialize status filters from URL
function initStatusFilters(statusParam: string | null): ICheckboxState {
  const statusValues = statusParam ? statusParam.split(',') : [];

  return {
    unconfirmed: statusValues.includes(EventStatus.UNCONFIRMED.toString()),
    under_reviewing: statusValues.includes(
      EventStatus.UNDER_REVIEWING.toString(),
    ),
    confirmed: statusValues.includes(EventStatus.CONFIRMED.toString()),
  };
}
