"use client";

import {useAuth} from "@/lib/hooks/useAuth";
import {memo, startTransition, useLayoutEffect, useMemo, useState} from "react";

// TODO: Remove flicker when set user info
const UserInfo = memo(function UserInfo() {
    const auth = useAuth();
    const [info, setInfo] = useState<{username: string; role: string}>();
    const memoizedAuth = useMemo(() => auth, [auth]);

    useLayoutEffect(() => {
        if (memoizedAuth) {
            startTransition(() => {
                setInfo({
                    username: auth?.username as string,
                    role: auth?.role as string,
                });
            });
        }
    }, [auth?.role, auth?.username, memoizedAuth]);

    return (
        <div className="">
            <h1 className="text-2xl font-normal text-[#abb7bc]">
                こんにちは {info?.username}
            </h1>
            <h1 className="text-[#c3cbcf]">{info?.role}</h1>
        </div>
    );
});

export default UserInfo;
