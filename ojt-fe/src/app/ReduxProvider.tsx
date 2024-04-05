"use client";

import {makeStore, type AppStore} from "@/lib/redux/store";
import type {LayoutProps} from "@/types";
import {useRef} from "react";
import {Provider} from "react-redux";

export default function ReduxProvider({children}: LayoutProps) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
