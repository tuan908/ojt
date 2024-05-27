"use client";

import {useAuth} from "@/lib/hooks/useAuth";
import {convertRole} from "@/lib/utils/role";

// TODO: Remove flicker when set user info
export default function UserInfo() {
    const {auth} = useAuth();

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-normal text-[#abb7bc]">
                こにちは {auth ? auth?.name : null}
            </h1>
            <h1 className="text-[#c3cbcf]">
                {auth ? convertRole(auth.role) : null}
            </h1>
        </div>
    );
}
