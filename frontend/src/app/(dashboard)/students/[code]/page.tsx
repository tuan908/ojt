import type {Metadata} from 'next';
import {notFound, unauthorized} from 'next/navigation';
import {getEvents, getGrades} from '~/app/actions/shared';
import {getStudentByCode} from '~/app/actions/student';
import NewEventForm from '~/features/student/components/new-event-form';
import StudentDetail from '~/features/student/components/student-detail';
import StudentInfo from '~/features/student/components/student-info';
import Container from '~/features/students/components/container';
import {UserRole} from '~/shared/constants';
import {getSession} from '~/shared/lib/session';
import type {IPageProps} from '~/shared/types';

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  // read route params
  const {code} = await params;

  // fetch data
  const student = await getStudentByCode(code);

  return {
    title: student?.data?.code,
  };
}

export default async function Page({params}: IPageProps) {
  const {code} = await params;
  const user = await getSession();

  if (!code) {
    notFound();
  }

  if (!user) {
    unauthorized();
  }

  const [grades, events, student] = await Promise.all([
    getGrades(),
    getEvents(),
    getStudentByCode(code),
  ]);

  if (!student) {
    notFound();
  }
  const name = student.data?.name;
  const grade = student.data?.grade;

  return (
    <div className="flex flex-col w-full h-full m-auto">
      {user.role === UserRole.Student && (
        <NewEventForm
          studentCode={code}
          eventOptions={events}
          gradeName={user.grade}
          username={user.username}
        />
      )}

      <Container>
        {/* Student Info */}
        <StudentInfo code={code} name={name} grade={grade} role={user?.role} />

        {/* Student Details */}
        <StudentDetail
          code={code}
          grades={grades}
          events={events}
          role={user.role}
        />
      </Container>
    </div>
  );
}
