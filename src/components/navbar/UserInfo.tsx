"use client";

import {useAuth} from "@/lib/hooks/useAuth";
import {memo, useEffect, useMemo, useState} from "react";

// TODO: Remove flicker when set user info
const UserInfo = memo(function UserInfo() {
    const auth = useAuth();
    const [info, setInfo] = useState<{username: string; role: string}>();
    const memoizedAuth = useMemo(() => auth, [auth]);

    useEffect(() => {
        if (memoizedAuth) {
            setInfo({
                username: auth?.username as string,
                role: auth?.role as string,
            });
        }
    }, [auth?.role, auth?.username, memoizedAuth]);

    return (
        <div className="">
            <h1 className="text-2xl font-normal text-[#abb7bc]">
                Hello {info ? info.username : null}
            </h1>
            <h1 className="text-[#c3cbcf]">{info ? info.role : null}</h1>
        </div>
    );
});

export default UserInfo;
