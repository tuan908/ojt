"use client";

import {decrypt, type JwtPayload} from "@/lib/auth";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";

export function useAuth() {
    const [auth, setAuth] = useState<JwtPayload | undefined>();

    async function getVerifiedToken() {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? undefined;
        if (token) {
            const verifiedToken = await decrypt(token);
            setAuth(verifiedToken);
        }
    }

    useEffect(() => {
        getVerifiedToken();
    }, []);

    return {auth};
}
