import { getEvents, getGrades } from "@/app/actions/common.action";
import { getSession } from "@/app/actions/event.action";
import { getStudentByCode } from "@/app/actions/student.action";
import PageWrapper from "@/components/PageWrapper";
import { type DynamicPageProps } from "@/types";
import { CircularProgress } from "@mui/material";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import Header from "./Header";
import SearchArea from "./SearchArea";
import StudentInfo from "./StudentInfo";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params }: Props,
    _parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const {id} = await params

    // fetch data
    const student = await getStudentByCode(id);

    return {
        title: student?.code,
    };
}

export default async function Page({ params }: DynamicPageProps) {
    const {id} = await params;
    const [auth, grades, events, info] = await Promise.all([
        getSession(),
        getGrades(),
        getEvents(),
        getStudentByCode(id),
    ]);

    return (
        <div className="flex flex-col w-full h-full m-auto">
            <Suspense fallback={<>Loading student info...</>}>
                <Header code={id} eventOptions={events!} />
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
                        id={id}
                        grades={grades!}
                        events={events!}
                        data={info!}
                    />
                </Suspense>
            </PageWrapper>
        </div>
    );
}
