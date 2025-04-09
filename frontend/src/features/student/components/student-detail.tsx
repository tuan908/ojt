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
import type {ISession} from '~/shared/lib/session';
import type {IEventDto, IGradeDto} from '~/shared/types';
import {tryCatch} from '~/shared/utils';
import StudentEventsDatatable from './student-datatable';

interface IStudentDetailProps {
  code: string;
  grades?: IGradeDto[];
  events?: IEventDto[];
  auth?: ISession;
}

interface ICheckboxState {
  unconfirmed: boolean;
  under_reviewing: boolean;
  confirmed: boolean;
  [key: string]: boolean;
}

const INIT_PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
};

export default function StudentDetail({
  code,
  events,
  grades,
  auth,
}: IStudentDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state from URL search params
  const [check, setCheck] = useState<ICheckboxState>(() => {
    const statusParam = searchParams.get('status');
    const statusValues = statusParam ? statusParam.split(',') : [];

    return {
      unconfirmed: statusValues.includes(EventStatus.UNCONFIRMED.toString()),
      under_reviewing: statusValues.includes(
        EventStatus.UNDER_REVIEWING.toString(),
      ),
      confirmed: statusValues.includes(EventStatus.CONFIRMED.toString()),
    };
  });

  const [grade, setGrade] = useState(searchParams.get('grade') || '');
  const [eventName, setEventName] = useState(searchParams.get('event') || '');
  const [pagination, setPagination] = useState<PaginationState>(
    () => INIT_PAGINATION,
  );

  const getQueryKey = useCallback(() => {
    return [QUERY_KEY.EVENT, code, pagination.pageIndex, pagination.pageSize];
  }, [code, pagination]);

  // Memoized status array to prevent unnecessary re-renders
  const status = useMemo(() => {
    return Object.entries(check)
      .filter(([_, checked]) => checked)
      .map(
        ([key]) => EventStatus[key.toUpperCase() as keyof typeof EventStatus],
      );
  }, [check]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const {name, checked} = event.target;
    setCheck(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const {data: rows} = useQuery({
    queryKey: getQueryKey(),
    queryFn: async () => {
      const res = await getStudentEventsByStudentCode(code, {
        grade,
        eventName,
        status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

      if (!res || !res?.data) {
        return [];
      }
      return res.data;
    },
  });

  console.log(rows);

  async function handleSearch() {
    const params = new URLSearchParams();

    if (grade != '') {
      params.set('grade', grade);
    }

    if (eventName != '') {
      params.set('event', eventName);
    }

    if (status.length > 0) {
      params.set('status', status.join(','));
    }

    const studentPromise = getStudentEventsByStudentCode(code, {
      grade,
      eventName,
      status,
    });

    const {data: result} = await tryCatch(studentPromise);
    const events = result ? result!?.data : [];
    queryClient.setQueryData(getQueryKey(), events);

    const search = params.toString();
    const url = search ? `${pathname}?${search}` : pathname;
    router.push(url);
  }

  return (
    <>
      <div className="border-b md:px-8 px-4 flex flex-col gap-y-4 md:flex-row md:items-center py-4 md:gap-x-8">
        {/* クラス名 */}
        <LegacySelect
          name="grade"
          label={json.label.grade}
          options={grades ?? []}
          value={grade}
          onChange={e => setGrade(e.target.value)}
        />

        {/* イベント */}
        <LegacySelect
          name="event"
          label={json.label.event}
          options={events ?? []}
          value={eventName}
          onChange={e => setEventName(e.target.value)}
        />

        <div className="flex flex-col items-center md:flex-row md:gap-x-8">
          <span>ステータス：</span>

          {/* 未確認 */}
          <Checkbox
            label={json.status.unconfirmed}
            name="unconfirmed"
            checked={check.unconfirmed}
            handleChange={handleChange}
          />

          {/* 確認中 */}
          <Checkbox
            label={json.status.underReviewing}
            name="under_reviewing"
            checked={check.under_reviewing}
            handleChange={handleChange}
          />

          {/* 修了*/}
          <Checkbox
            label={json.status.confirmed}
            name="confirmed"
            checked={check.confirmed}
            handleChange={handleChange}
          />
        </div>

        <Tooltip title={json.common.search}>
          <button
            className="border-none outline-none flex items-center justify-center cursor-pointer"
            onClick={handleSearch}>
            <Search className="text-icon-default" size="1.5rem" />
          </button>
        </Tooltip>
      </div>

      {/* Table */}
      <div className="w-full px-10 pt-6">
        <StudentEventsDatatable
          rows={rows ?? []}
          code={code}
          role={auth?.role}
          username={auth?.username}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
