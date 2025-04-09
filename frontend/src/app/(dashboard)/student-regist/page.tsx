import dynamic from 'next/dynamic';
import {notFound} from 'next/navigation';
import {getEvents, getHashtags} from '~/app/actions/shared';
import {getSession} from '~/shared/lib/session';
import type {IPageProps} from '~/shared/types';
import {tryCatch} from '~/shared/utils';

const StudentEventContent = dynamic(
  () => import('~/features/student/components/student-event-detail'),
);

interface IStudentEventDetailPageProps extends IPageProps {
  searchParams: Promise<{
    mode?: string;
    student_event_id?: string;
    student_code?: string;
  }>;
}

export default async function Page({
  searchParams,
}: IStudentEventDetailPageProps) {
  const {mode, student_code, student_event_id} = await searchParams;

  if (!mode || !student_event_id || !student_code) {
    notFound();
  }

  const {data} = await tryCatch(
    Promise.all([getEvents(), getHashtags(), getSession()]),
  );

  const [events, hashtags, session] = data ?? [];

  return (
    <StudentEventContent
      studentCode={student_code}
      studentEventId={Number.parseInt(student_event_id!)}
      screenMode={mode!}
      session={session!}
      events={events!}
      hashtags={hashtags!}
    />
  );
}
