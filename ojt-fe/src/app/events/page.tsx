import {getEventDetailById, getSession} from "@/app/actions/event.action";
import {DynamicPageProps} from "@/types";
import {getEvents, getHashtags} from "../actions/common.action";
import EventUi from "./_ui";

export default async function Page({searchParams}: DynamicPageProps) {
    const id = !Array.isArray(searchParams?.id!)
        ? parseInt(searchParams?.id!)
        : parseInt(searchParams?.id![0]!);
    const mode = !Array.isArray(searchParams?.mode!) ? searchParams?.mode : "";

    if(mode === "") {
        throw new Error("Invalid mode")
    }

    const [eventDetail, events, hashtags, session] = await Promise.all([
        getEventDetailById(id),
        getEvents(),
        getHashtags(),
        getSession(),
    ]);

    return (
        <EventUi
            id={id}
            mode={mode}
            auth={session}
            detail={eventDetail}
            events={events}
            hashtags={hashtags}
        />
    );
}
