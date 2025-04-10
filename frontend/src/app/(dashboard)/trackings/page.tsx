import {notFound} from 'next/navigation';
import {getGrades, getHashtags} from '~/app/actions/shared';
import {getTracking} from '~/app/actions/tracking';
import DoughnutChart from '~/features/tracking/components/doughnut-chart';
import HashtagCard from '~/features/tracking/components/hashtag-card';
import StackedBarChart from '~/features/tracking/components/stacked-chart';
import StudentCard from '~/features/tracking/components/student-card';
import type {IPageProps} from '~/shared/types';

interface ITrackingPageProps extends IPageProps {
  searchParams: Promise<{student_code?: string}>;
}

export default async function Page({searchParams}: ITrackingPageProps) {
  const {student_code} = await searchParams;

  if (!student_code) notFound();

  const [_hashtags, grades, studentInfo] = await Promise.all([
    getHashtags(),
    getGrades(),
    getTracking(student_code),
  ]);

  const labels = Array.isArray(grades) ? grades.map(x => x.name) : [];
  const hashtags = Array.isArray(_hashtags) ? _hashtags : [];

  return (
    <div className="grid grid-cols-1 gap-y-8">
      <div className="w-full flex gap-x-10 justify-between items-center">
        {/* Student Info */}
        <StudentCard code={studentInfo?.code!} name={studentInfo?.name!} />
        <DoughnutChart data={studentInfo?.hashtags.doughnut!} />
        <HashtagCard hashtags={hashtags} />
      </div>

      <StackedBarChart labels={labels} data={studentInfo?.hashtags.stacked!} />
    </div>
  );
}
