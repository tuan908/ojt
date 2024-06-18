import {getValidToken} from "@/app/actions/event.action";

import {getEventDetailById} from "@/app/actions/event.action";
import {DynamicPageProps} from "@/types";
import {Suspense} from "react";
import {getEvents, getHashtags} from "../actions/common.action";
import EventUi from "./_ui";

export default async function Page({searchParams}: DynamicPageProps) {
    const id = !Array.isArray(searchParams?.id!)
        ? parseInt(searchParams?.id!)
        : parseInt(searchParams?.id![0]!);
    const mode = !Array.isArray(searchParams?.mode!) ? searchParams?.mode : "";

    const [detail, events, hashtags, auth] = await Promise.all([
        getEventDetailById(id),
        getEvents(),
        getHashtags(),
        getValidToken(),
    ]);

    return (
        <Suspense>
            <EventUi
                id={id}
                mode={mode}
                auth={auth}
                detail={detail}
                events={events}
                hashtags={hashtags}
            />
        </Suspense>
    );
}
