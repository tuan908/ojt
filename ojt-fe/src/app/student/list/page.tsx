import PageWrapper from "@/components/PageWrapper";
import SearchArea from "./_SearchArea";
import {getGrades, getEvents, getHashtags} from "@/app/actions/common";
import {getStudents} from "@/app/actions/student";

export default async function Page() {
    const grades = await getGrades();
    const events = await getEvents();
    const hashtags = await getHashtags();
    const students = await getStudents();

    return (
        <PageWrapper gapY>
            <SearchArea
                rows={students.content}
                grades={grades}
                events={events}
                hashtags={hashtags}
            />
        </PageWrapper>
    );
}
