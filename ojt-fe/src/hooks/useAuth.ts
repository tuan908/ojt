"use client";

import AuthService, {type JwtPayload} from "@/services/auth.service";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";

export function useAuth() {
    const [auth, setAuth] = useState<JwtPayload | undefined>();

    async function getVerifiedToken() {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? undefined;
        if (token) {
            const verifiedToken = await AuthService.verify(token);
            setAuth(verifiedToken);
        }
    }

    useEffect(() => {
        getVerifiedToken();
    }, []);

    return {auth};
}
