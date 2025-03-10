import { getEvents, getGrades, getHashtags } from "@/app/actions/common";
import { getStudents } from "@/app/actions/student";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import type { Metadata } from "next";
import StudentContent from "./StudentContent";

export const metadata: Metadata = {
    title: "学生イベントリスト",
    description: "学生イベント",
};

export default async function Page() {
    const [grades, events, hashtags, students] = await Promise.all([
        getGrades(),
        getEvents(),
        getHashtags(),
        getStudents(),
    ]);

    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center bg-[#ededed]">
                <PageWrapper gapY>
                    <StudentContent
                        students={students}
                        grades={grades!}
                        events={events!}
                        hashtags={hashtags!}
                    />
                </PageWrapper>
            </div>
        </div>
    );
}
