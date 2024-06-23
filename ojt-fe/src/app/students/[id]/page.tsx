import {getEvents, getGrades} from "@/app/actions/common.action";
import {getSession} from "@/app/actions/event.action";
import {getStudentByCode} from "@/app/actions/student.action";
import PageWrapper from "@/components/PageWrapper";
import {type DynamicPageProps} from "@/types";
import {CircularProgress} from "@mui/material";
import type {Metadata, ResolvingMetadata} from "next";
import {Suspense} from "react";
import Header from "./_Header";
import SearchArea from "./_SearchArea";
import StudentInfo from "./_StudentInfo";

type Props = {
    params: {id: string};
    searchParams: {[key: string]: string | string[] | undefined};
};

export async function generateMetadata(
    {params}: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id;

    // fetch data
    const student = await getStudentByCode(id);

    return {
        title: student?.code,
    };
}

export default async function Page({params}: DynamicPageProps) {
    const [auth, grades, events, info] = await Promise.all([
        getSession(),
        getGrades(),
        getEvents(),
        getStudentByCode(params.id),
    ]);

    return (
        <div className="flex flex-col w-full h-full m-auto">
            <Suspense fallback={<>Loading student info...</>}>
                <Header auth={auth} />
            </Suspense>
            <PageWrapper>
                {/* Student Info */}
                <Suspense fallback={<>Loading student info...</>}>
                    <StudentInfo
                        auth={auth}
                        info={{
                            code: info?.code,
                            name: info?.name,
                            grade: info?.grade,
                        }}
                    />
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
                        params={params}
                        grades={grades!}
                        events={events!}
                        data={info!}
                    />
                </Suspense>
            </PageWrapper>
        </div>
    );
}
