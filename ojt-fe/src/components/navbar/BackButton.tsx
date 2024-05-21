"use client";

import {OjtUserRole} from "@/constants";
import {useAuth} from "@/lib/hooks/useAuth";
import ArrowBack from "@mui/icons-material/ArrowBack";
import {usePathname, useRouter} from "next/navigation";
import {type SyntheticEvent} from "react";

export default function BackButton() {
    const {auth} = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    function handleClick(e: SyntheticEvent) {
        router.back();
    }

    const regex = /\/student\/.*/gm;

    const isShow = () => {
        if (regex.test(pathname)) {
            if (
                pathname === "/student/list" &&
                auth?.role! !== OjtUserRole.Student
            ) {
                return false;
            } else if (auth?.role! === OjtUserRole.Student) {
                return false;
            }
        }
        return true;
    };

    return (
        <div className="pr-2 h-full">
            {isShow() ? (
                <button
                    onClick={e => handleClick(e)}
                    className="border-none outline-none"
                >
                    <ArrowBack
                        className="text-icon-default"
                        sx={{width: 36, height: 36}}
                    />
                </button>
            ) : null}
        </div>
    );
}
