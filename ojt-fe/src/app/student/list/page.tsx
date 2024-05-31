import {getEvents, getGrades, getHashtags} from "@/app/actions/common";
import {getStudents} from "@/app/actions/student";
import PageWrapper from "@/components/PageWrapper";
import SearchArea from "./_SearchArea";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "リスト",
};

export default async function Page() {
    const [grades, events, hashtags, rows] = await Promise.all([
        getGrades(),
        getEvents(),
        getHashtags(),
        getStudents(),
    ]);

    return (
        <PageWrapper gapY>
            <SearchArea
                rows={rows!}
                grades={grades!}
                events={events!}
                hashtags={hashtags!}
            />
        </PageWrapper>
    );
}
