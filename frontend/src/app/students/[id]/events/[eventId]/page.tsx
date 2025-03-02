import { getEvents, getHashtags } from "@/app/actions/common.action";
import { getEventDetailById, getSession } from "@/app/actions/event.action";
import { type DynamicPageProps } from "@/types";
import EventDetailContent from "./EventDetailContent";

export default async function Page({ searchParams, params }: DynamicPageProps) {
    const mode = !Array.isArray(searchParams?.mode!) ? searchParams?.mode : "";
    const {id, eventId} = await params;

    if (mode === "") {
        throw new Error("Invalid mode");
    }

    const [eventDetail, events, hashtags, session] = await Promise.all([
        getEventDetailById({
            studentCode: id,
            eventDetailId: eventId,
        }),
        getEvents(),
        getHashtags(),
        getSession(),
    ]);

    return (
        <EventDetailContent
            studentCode={id}
            eventDetailId={eventId}
            mode={mode}
            auth={session}
            detail={eventDetail}
            events={events}
            hashtags={hashtags}
        />
    );
}
