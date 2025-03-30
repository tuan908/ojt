"use client";

import type { Session } from "@/shared/lib/session";
import { convertRole } from "@/shared/utils";
import { useMemo } from "react";

export default function useInfo(auth?: Session) {
    return useMemo(() => {
        if (!auth) {
            return {};
        }

        return {
            fullName: auth.name,
            role: convertRole(auth.role),
        };
    }, [auth]);
}
