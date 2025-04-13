import {notFound} from 'next/navigation';
import {getHashtags} from '~/app/actions/shared';
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

  const [_hashtags, student] = await Promise.all([
    getHashtags(),
    getTracking(student_code),
  ]);

  const hashtags = Array.isArray(_hashtags) ? _hashtags : [];
  const stacked = student?.hashtags.stacked!;

  return (
    <div className="grid grid-cols-1 gap-y-8">
      <div className="w-full flex gap-x-10 justify-between items-center">
        {/* Student Info */}
        <StudentCard code={student?.code!} name={student?.name!} />
        <DoughnutChart data={student?.hashtags.doughnut!} />
        <HashtagCard hashtags={hashtags} />
      </div>

      <StackedBarChart labels={stacked?.xAxis?.data} series={stacked?.series} />
    </div>
  );
}
