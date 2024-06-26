"use client";

import type {JwtPayload} from "@/lib/auth";
import {convertRole} from "@/utils";
import {useMemo} from "react";

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
