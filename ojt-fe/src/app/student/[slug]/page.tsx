import {getGrades} from "@/app/actions/common";
import {getEventDetails, getVerifiedToken} from "@/app/actions/event";
import {getStudentByCode} from "@/app/actions/student";
import PageWrapper from "@/components/PageWrapper";
import {Suspense} from "react";
import Header from "./_Header";
import SearchArea from "./_SearchArea";
import StudentInfo from "./_StudentInfo";

export default async function Page({params}: {params: {slug: string}}) {
    const auth = await getVerifiedToken();
    const grades = await getGrades();
    const events = await getEventDetails();
    const studentInfo = await getStudentByCode(params.slug);

    return (
        <div className="flex flex-col w-full h-full m-auto">
            <Suspense fallback={<>Loading student info...</>}>
                <Header auth={auth} />
            </Suspense>
            <PageWrapper>
                {/* Student Info */}

                <Suspense fallback={<>Loading student info...</>}>
                    <StudentInfo auth={auth} info={studentInfo} />
                </Suspense>

                {/* ?? */}
                <Suspense fallback={<>Loading search area...</>}>
                    <SearchArea
                        params={params}
                        grades={grades}
                        events={events}
                        data={studentInfo}
                    />
                </Suspense>
            </PageWrapper>
        </div>
    );
}
