import dynamic from 'next/dynamic';
import {notFound} from 'next/navigation';
import {getGrades, getHashtags} from '~/app/actions/shared';
import {getTracking} from '~/app/actions/tracking';
import type {IPageProps} from '~/shared/types';

const DoughnutChart = dynamic(
  () => import('~/features/tracking/components/doughnut-chart'),
);
const HashtagCard = dynamic(
  () => import('~/features/tracking/components/hashtag-card'),
);
const StackedBarChart = dynamic(
  () => import('~/features/tracking/components/stacked-chart'),
);
const StudentCard = dynamic(
  () => import('~/features/tracking/components/student-card'),
);

interface ITrackingPageProps extends IPageProps {
  searchParams: Promise<{student_code?: string}>;
}

export default async function Page({searchParams}: ITrackingPageProps) {
  const {student_code} = await searchParams;

  if (!student_code) notFound();

  const [hashtags, grades, studentInfo] = await Promise.all([
    getHashtags(),
    getGrades(),
    getTracking(student_code),
  ]);

  return (
    <div className="grid grid-cols-1 gap-y-8">
      <div className="w-full flex gap-x-10 justify-between items-center">
        {/* Student Info */}
        <StudentCard code={studentInfo?.code!} name={studentInfo?.name!} />
        <DoughnutChart data={studentInfo?.hashtags.doughnut!} />
        <HashtagCard hashtags={hashtags ?? []} />
      </div>

      <StackedBarChart
        labels={grades ? grades.map(x => x.name) : []}
        data={studentInfo?.hashtags.stacked!}
      />
    </div>
  );
}
