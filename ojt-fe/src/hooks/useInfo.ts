"use client";

import {OjtJwtPayload} from "@/services/auth.service";
import Utils from "@/utils";
import {useMemo} from "react";

export default function useInfo(auth?: OjtJwtPayload) {
    const info = useMemo(() => {
        if (auth) {
            return {
                fullName: auth.name,
                role: Utils.convertRole(auth.role),
            };
        }
        return {
            fullName: undefined,
            role: undefined,
        };
    }, [auth]);

    return {...info};
}
