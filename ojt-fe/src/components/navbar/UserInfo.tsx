"use client";

import type {MyJwtPayload} from "@/lib/auth";
import {useAuth} from "@/lib/hooks/useAuth";
import {convertRole} from "@/lib/utils/role";
import {useEffect, useState} from "react";

type UserPayload = Partial<Pick<MyJwtPayload, "name" | "role">>;

// TODO: Remove flicker when set user info
export default function UserInfo() {
    const {auth} = useAuth();
    const [info, setInfo] = useState<UserPayload | null>(null);

    useEffect(() => {
        if (auth !== null) {
            setInfo({
                name: auth.name,
                role: convertRole(auth.role),
            });
        }
    }, [auth]);

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-normal text-[#abb7bc]">
                こにちは {info ? info.name : null}
            </h1>
            <h1 className="text-[#c3cbcf]">{info ? info.role : null}</h1>
        </div>
    );
}
