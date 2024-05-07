"use client";

import {verifyJwtToken, type OjtJwtPayload} from "@/lib/auth";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";

export function useAuth() {
    const [auth, setAuth] = useState<OjtJwtPayload | undefined>();

    async function getVerifiedToken() {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? undefined;
        if (token) {
            const verifiedToken = await verifyJwtToken(token);
            setAuth(verifiedToken);
        }
    }

    useEffect(() => {
        getVerifiedToken();
    }, []);

    return {auth};
}
