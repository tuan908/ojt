"use client";

import {OjtRoute, OjtUserRole} from "@/constants";
import {useAuth} from "@/hooks/useAuth";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import {useMemo} from "react";

export default function Error() {
    const {auth} = useAuth();

    const href = useMemo(() => {
        if (auth) {
            if (auth.role === OjtUserRole.Student) {
                return `/student/${auth.code}`;
            }

            return OjtRoute.StudentList;
        }

        return OjtRoute.Login;
    }, [auth]);

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 justify-center items-center">
            <h1 className="text-red-500 text-6xl font-bold">500</h1>
            <h1 className="text-red-500 text-4xl font-bold">
                エラーが発生しました
            </h1>

            <Link href={href} className="flex items-center text-2xl font-bold">
                <ArrowBackIos sx={{fontSize: "1.5rem"}} />
                ホームページに戻る
            </Link>
        </div>
    );
}
