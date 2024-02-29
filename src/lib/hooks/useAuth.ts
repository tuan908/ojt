"use client";

import {verifyJwtToken} from "@/lib/auth";
import {type JWTPayload} from "jose";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";

export function useAuth() {
    const [auth, setAuth] = useState<JWTPayload | null>(null);

    const getVerifiedToken = async () => {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;
        const verifiedToken = await verifyJwtToken(token);
        setAuth(verifiedToken);
    };

    useEffect(() => {
        getVerifiedToken();
    }, []);

    return auth;
}
