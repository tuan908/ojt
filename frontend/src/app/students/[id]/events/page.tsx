import { getEvents, getHashtags } from "@/app/actions/shared";
import { verifySession } from "@/shared/lib/dal";
import type { DynamicPageProps } from "@/shared/types";
import { tryCatch } from "@/shared/utils";
import dynamic from "next/dynamic";

const StudentEventContent = dynamic(
    () => import("@/features/student/components/student-event-content")
);

export default async function Page({ searchParams, params }: DynamicPageProps) {
    const { data: pageParam } = await tryCatch(
        Promise.all([searchParams, params])
    );
    const [_searchParams, _params] = pageParam!;

    if (!_searchParams || !_searchParams?.mode) {
        throw new Error("Invalid mode");
    }

    const screenMode = Array.isArray(_searchParams?.mode)
        ? _searchParams?.mode.join("")
        : _searchParams?.mode;
    const studentCode = Array.isArray(_params?.id)
        ? _params?.id.join("")
        : _params?.id!;
    const studentEventId = Array.isArray(_searchParams?.eventId)
        ? _searchParams?.eventId.join("")
        : _searchParams?.eventId!;

    const { data } = await tryCatch(
        Promise.all([getEvents(), getHashtags(), verifySession()])
    );

    const [events, hashtags, session] = data!;

    return (
        <StudentEventContent
            studentCode={studentCode}
            studentEventId={Number.parseInt(studentEventId)}
            screenMode={screenMode}
            session={session!}
            events={events}
            hashtags={hashtags}
        />
    );
}
