import {getEvents, getGrades} from "@/app/actions/common";
import {getValidToken} from "@/app/actions/event";
import {getStudentByCode} from "@/app/actions/student";
import PageWrapper from "@/components/PageWrapper";
import {type DynamicPageProps} from "@/types";
import {CircularProgress} from "@mui/material";
import type {Metadata, ResolvingMetadata} from "next";
import {Suspense} from "react";
import Header from "./_Header";
import SearchArea from "./_SearchArea";
import StudentInfo from "./_StudentInfo";

type Props = {
    params: {slug: string};
    searchParams: {[key: string]: string | string[] | undefined};
};

export async function generateMetadata(
    {params}: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.slug;

    // fetch data
    const student = await getStudentByCode(id);

    return {
        title: student?.code,
    };
}

export default async function Page(props: DynamicPageProps) {
    const [auth, grades, events, studentInfo] = await Promise.all([
        getValidToken(),
        getGrades(),
        getEvents(),
        getStudentByCode(props.params.slug),
    ]);

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
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <CircularProgress color="success" />
                        </div>
                    }
                >
                    <SearchArea
                        params={props.params}
                        grades={grades}
                        events={events}
                        data={studentInfo!}
                    />
                </Suspense>
            </PageWrapper>
        </div>
    );
}
