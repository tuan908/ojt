"use client";

import {UserRole} from "@/constants";
import {useAuth} from "@/hooks/useAuth";
import ArrowBack from "@mui/icons-material/ArrowBack";
import {usePathname, useRouter} from "next/navigation";
import {useMemo, type SyntheticEvent} from "react";

export default function BackButton() {
    const {auth} = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    function handleClick(e: SyntheticEvent) {
        e.preventDefault();
        router.back();
    }

    const isShow = useMemo(() => {
        const regex = /\/student\/.*/gm;

        if (pathname === "/students") {
            return false;
        }

        if (regex.test(pathname) && auth?.role! === UserRole.Student) {
            return false;
        }

        return true;
    }, [pathname, auth?.role]);

    if (!isShow) {
        return null;
    }

    return (
        <div className="pr-2 h-full">
            <button
                onClick={e => handleClick(e)}
                className="border-none outline-none"
            >
                <ArrowBack
                    className="text-icon-default"
                    sx={{width: 36, height: 36}}
                />
            </button>
        </div>
    );
}
