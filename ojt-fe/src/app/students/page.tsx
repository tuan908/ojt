import {getEvents, getGrades, getHashtags} from "@/app/actions/common.action";
import {getStudents} from "@/app/actions/student.action";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import type {Metadata} from "next";
import SearchArea from "./_SearchArea";

export const metadata: Metadata = {
    title: "リスト | 学生イベントリスト",
    description: "リスト | 学生イベント",
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
                    <SearchArea
                        students={students!}
                        grades={grades!}
                        events={events!}
                        hashtags={hashtags!}
                    />
                </PageWrapper>
            </div>
        </div>
    );
}
