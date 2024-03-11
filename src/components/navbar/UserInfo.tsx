"use client";

import type {MyJwtPayload} from "@/lib/auth";
import {useAuth} from "@/lib/hooks/useAuth";
import {memo, useEffect, useState} from "react";

// TODO: Remove flicker when set user info
const UserInfo = memo(function UserInfo() {
    const auth = useAuth();
    const [info, setInfo] =
        useState<Partial<Pick<MyJwtPayload, "username" | "role">>>();

    useEffect(() => {
        setInfo({
            username: auth?.username,
            role: auth?.role,
        });
    }, [auth?.role, auth?.username]);

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-normal text-[#abb7bc]">
                Hello {info ? info.username : null}
            </h1>
            <h1 className="text-[#c3cbcf]">{info ? info.role : null}</h1>
        </div>
    );
});

export default UserInfo;
