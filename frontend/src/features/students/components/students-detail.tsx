'use client';

import {Input, Tooltip} from '@mui/material';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {PaginationState} from '@tanstack/react-table';
import {Search} from 'lucide-react';
import {useState, type SyntheticEvent} from 'react';
import {getStudents} from '~/app/actions/students';
import ColorHashtag from '~/features/students/components/color-hashtag';
import {Autocomplete} from '~/shared/components/legacy/autocomplete';
import LegacySelect from '~/shared/components/legacy/select';
import {QUERY_KEY, STRING_EMPTY} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import type {
  IEventDto,
  IGradeDto,
  IHashtagDto,
  IStudentDto,
} from '~/shared/types';
import StudentDataTable from './students-datatable';

interface IStudentsDetailProps {
  grades: IGradeDto[];
  hashtags: IHashtagDto[];
  events: IEventDto[];
}

interface ISkill {
  label: string;
  color: string;
}

const INIT_PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
};

export default function StudentsDetail({
  grades,
  hashtags,
  events,
}: IStudentsDetailProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<ISkill[]>([]);
  const [inputValue, setInputValue] = useState(STRING_EMPTY);
  const [searchCondition, setSearchCondition] = useState<IStudentDto>({
    event: STRING_EMPTY,
    grade: STRING_EMPTY,
  });
  const [pagination, setPagination] =
    useState<PaginationState>(INIT_PAGINATION);

  const {data: rows} = useQuery({
    queryKey: [QUERY_KEY.STUDENTS, pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const queryResult = await getStudents({
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      });
      return queryResult?.data ?? [];
    },
    placeholderData: keepPreviousData,
  });

  async function handleSearch(event: SyntheticEvent) {
    event?.preventDefault();

    let request: IStudentDto = {};

    if (searchCondition.name) {
      request.name = searchCondition.name;
    }

    if (searchCondition.grade) {
      request.grade = searchCondition.grade;
    }

    if (searchCondition.event) {
      request.event = searchCondition.event;
    }

    if (searchCondition.event) {
      request.event = searchCondition.event;
    }

    if (selectedHashtags.length > 0) {
      request.hashtags = selectedHashtags.map(tag => tag.label).join(',');
    }
    const searchResult = await getStudents({
      ...request,
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    });

    queryClient.setQueryData(
      [QUERY_KEY.STUDENTS, pagination.pageIndex, pagination.pageSize],
      searchResult?.data ?? [],
    );
  }

  function handleRemoveHashtag(_index: number): void {
    setSelectedHashtags(
      selectedHashtags.filter((_, index) => index !== _index),
    );
  }

  return (
    <>
      <div className="px-8 pt-4 flex flex-col items-center gap-y-2 md:gap-x-8 md:flex-row">
        {/* 学生の名前 */}
        <Input
          placeholder={json.common.studentName}
          className="w-56"
          sx={{bgcolor: '#ffffff', paddingX: 1}}
          name="name"
          onChange={e =>
            setSearchCondition(x => ({
              ...x,
              name: e.target.value,
            }))
          }
        />

        {/* クラス名 */}
        <LegacySelect
          name="grade"
          value={searchCondition.grade}
          onChange={event =>
            setSearchCondition(x => ({
              ...x,
              grade: event.target.value,
            }))
          }
          label={json.label.grade}
          options={grades ?? []}
        />

        {/* イベント */}
        <LegacySelect
          name="event"
          value={searchCondition.event}
          onChange={event =>
            setSearchCondition(x => ({
              ...x,
              event: event.target.value,
            }))
          }
          label={json.label.event}
          options={events ?? []}
        />

        {/* ハッシュタグ */}
        <Autocomplete
          hashtags={hashtags}
          open={open}
          setOpen={setOpen}
          inputValue={inputValue}
          setInputValue={setInputValue}
          selectedHashtags={selectedHashtags}
          setSelectedHashtags={setSelectedHashtags}
        />

        {/* Search Button */}
        <Tooltip title={json.common.search}>
          <button
            className="border-none outline-none flex items-center justify-center cursor-pointer"
            onClick={handleSearch}>
            <Search className="text-icon-default" size={32} />
          </button>
        </Tooltip>
      </div>
      <div className="w-full px-12 flex gap-x-2 flex-wrap">
        {selectedHashtags.map((skill, index) => (
          <ColorHashtag
            key={`skill#${index}`}
            onRemove={() => handleRemoveHashtag(index)}
            index={index}
            color={skill.color}>
            {skill.label}
          </ColorHashtag>
        ))}
      </div>
      <hr className="border-table" />
      <StudentDataTable
        rows={rows ?? []}
        pagination={pagination}
        setPagination={setPagination}
      />
    </>
  );
}
