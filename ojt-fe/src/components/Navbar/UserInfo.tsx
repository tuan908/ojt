"use client";

import {useAuth} from "@/hooks/useAuth";
import Utils from "@/utils";
import {useMemo} from "react";
import json from "@/dictionaries/jp.json";

// TODO: Remove flicker when set user info
export default function UserInfo() {
    const {auth} = useAuth();

    const {fullName, role} = useMemo(() => {
        if (auth) {
            return {
                fullName: auth.name,
                role: Utils.convertRole(auth.role),
            };
        }
        return {
            fullName: undefined,
            role: undefined,
        };
    }, [auth]);

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-normal text-[#abb7bc]">
                {json.common.hello} {fullName}
            </h1>
            <h1 className="text-[#c3cbcf]">{role}</h1>
        </div>
    );
}
