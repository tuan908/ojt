"use client";

import type {JwtPayload} from "@/lib/auth";
import {convertRole} from "@/utils";
import {useMemo} from "react";

export default function useInfo(auth?: JwtPayload) {
    const info = useMemo(() => {
        if (auth) {
            return {
                fullName: auth.name,
                role: convertRole(auth.role),
            };
        }
        return {
            fullName: undefined,
            role: undefined,
        };
    }, [auth]);

    return {...info};
}
