import { getEvents, getGrades, getHashtags } from "@/app/actions/shared";
import { getStudents } from "@/app/actions/students";
import { tryCatch } from "@/shared/utils";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PageWrapper = dynamic(
    () => import("@/features/students/components/page-wrapper")
);
const StudentContent = dynamic(
    () => import("@/features/students/components/students-content")
);
const Navbar = dynamic(() => import("@/shared/components/navbar"));

export const metadata: Metadata = {
    title: "学生",
    description: "学生イベント",
};

export default async function Page() {
    const { data } = await tryCatch(
        Promise.all([getGrades(), getEvents(), getHashtags(), getStudents()])
    );

    const [grades, events, hashtags, students] = data!;

    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center bg-[#ededed]">
                <PageWrapper gapY>
                    <StudentContent
                        rows={students}
                        grades={grades}
                        events={events}
                        hashtags={hashtags!}
                    />
                </PageWrapper>
            </div>
        </div>
    );
}
