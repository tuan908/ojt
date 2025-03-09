"use client";

import type { JwtPayload } from "@/lib/session";
import { convertRole } from "@/lib/utils";
import { useMemo } from "react";

export default function useInfo(auth?: JwtPayload) {
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
