"use client";

import {MyJwtPayload, verifyJwtToken} from "@/lib/auth";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";

export function useAuth() {
    const [auth, setAuth] = useState<MyJwtPayload | null>(null);

    async function getVerifiedToken() {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;
        const verifiedToken = await verifyJwtToken(token);
        setAuth(verifiedToken);
    }

    useEffect(() => {
        getVerifiedToken();
    }, []);

    return [auth];
}
