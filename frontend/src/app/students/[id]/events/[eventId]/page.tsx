import { getEventDetailById, getSession } from "@/app/actions/event.action";
import { type DynamicPageProps } from "@/types";
import { getEvents, getHashtags } from "@/app/actions/common.action";
import EventUi from "./_ui";

export default async function Page({ searchParams, params }: DynamicPageProps) {
    const mode = !Array.isArray(searchParams?.mode!) ? searchParams?.mode : "";

    if (mode === "") {
        throw new Error("Invalid mode");
    }

    const [eventDetail, events, hashtags, session] = await Promise.all([
        getEventDetailById({
            studentCode: params.id,
            eventDetailId: params.eventId,
        }),
        getEvents(),
        getHashtags(),
        getSession(),
    ]);

    return (
        <EventUi
            studentCode={params.id}
            eventDetailId={params.eventId}
            mode={mode}
            auth={session}
            detail={eventDetail}
            events={events}
            hashtags={hashtags}
        />
    );
}
