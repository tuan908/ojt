"use client";

import type { LayoutProps } from "@/shared/types";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "../redux/store";

export default function ReduxProvider({ children }: LayoutProps) {
    const storeRef = useRef<AppStore>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
