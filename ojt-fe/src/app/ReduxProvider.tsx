"use client";

import {type AppStore, makeStore} from "@/lib/redux/store";
import {useRef} from "react";
import {Provider} from "react-redux";

export default function ReduxProvider({
    children,
}: Readonly<{children: React.ReactNode}>) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
