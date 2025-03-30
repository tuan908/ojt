import { getEvents, getGrades } from "@/app/actions/shared";
import { getStudentByCode } from "@/app/actions/student";
import { verifySession } from "@/shared/lib/dal";
import { type DynamicPageProps } from "@/shared/types";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const NewEventForm = dynamic(
    () => import("@/features/student/components/new-event-form")
);
const StudentDetailContent = dynamic(
    () => import("@/features/student/components/student-detail")
);
const StudentInfo = dynamic(
    () => import("@/features/student/components/student-info")
);
const PageWrapper = dynamic(
    () => import("@/features/students/components/page-wrapper")
);

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const { id } = await params;

    // fetch data
    const student = await getStudentByCode(id);

    return {
        title: student?.code,
    };
}

export default async function Page({ params }: DynamicPageProps) {
    const { id } = await params;

    if (!id) {
        notFound();
    }

    const [user, grades, events, student] = await Promise.all([
        verifySession(),
        getGrades(),
        getEvents(),
        getStudentByCode(id),
    ]);

    return (
        <div className="flex flex-col w-full h-full m-auto">
            <NewEventForm
                studentCode={id}
                eventOptions={events!}
                gradeName={user!?.grade}
                username={user?.username!}
            />

            <PageWrapper>
                {/* Student Info */}

                <StudentInfo
                    auth={user}
                    info={{
                        code: student?.code,
                        name: student?.name,
                        grade: student?.grade,
                    }}
                />

                {/* ?? */}
                <StudentDetailContent
                    id={id}
                    grades={grades!}
                    events={events!}
                    data={student!}
                    auth={user}
                />
            </PageWrapper>
        </div>
    );
}
