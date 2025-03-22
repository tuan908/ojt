import { getEvents, getHashtags } from "@/app/actions/common";
import { getEventDetailById } from "@/app/actions/event";
import { verifySession } from "@/lib/dal";
import { type DynamicPageProps } from "@/types";
import EventDetailContent from "./page-content";

export default async function Page({ searchParams, params }: DynamicPageProps) {
    const { mode } = await searchParams!;
    const { id, eventId } = await params;

    if (!mode) {
        throw new Error("Invalid mode");
    }

    const [eventDetail, events, hashtags, session] = await Promise.all([
        getEventDetailById({
            studentCode: id,
            eventDetailId: eventId,
        }),
        getEvents(),
        getHashtags(),
        verifySession(),
    ]);

    return (
        <EventDetailContent
            studentCode={id}
            eventDetailId={eventId}
            mode={mode.toString()}
            auth={session}
            detail={eventDetail}
            events={events}
            hashtags={hashtags}
        />
    );
}
