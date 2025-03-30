import { getGrades, getHashtags } from "@/app/actions/shared";
import { getTracking } from "@/app/actions/tracking";
import DoughnutChart from "@/features/tracking/components/doughnut-chart";
import HashtagCard from "@/features/tracking/components/hashtag-card";
import StackedBarChart from "@/features/tracking/components/stacked-chart";
import StudentCard from "@/features/tracking/components/student-card";
import { type DynamicPageProps } from "@/shared/types";

export default async function Page({ params }: DynamicPageProps) {
    const { id } = await params;
    const [hashtags, grades, studentInfo] = await Promise.all([
        getHashtags(),
        getGrades(),
        getTracking(id),
    ]);

    return (
        <>
            <div className="pt-20 w-full flex gap-x-10 justify-between items-center">
                {/* Student Info */}
                <StudentCard
                    code={studentInfo?.code!}
                    name={studentInfo?.name!}
                />
                <DoughnutChart data={studentInfo?.hashtags.doughnut!} />
                <HashtagCard hashtags={hashtags ?? []} />
            </div>

            <StackedBarChart
                labels={grades ? grades.map(x => x.name) : []}
                data={studentInfo?.hashtags.stacked!}
            />
        </>
    );
}
