"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import {usePathname, useRouter} from "next/navigation";
import {type SyntheticEvent} from "react";

export default function BackButton() {
    const pathname = usePathname();
    const router = useRouter();

    function handleClick(e: SyntheticEvent) {
        router.back();
    }

    return (
        <div className="pr-2 h-full">
            {pathname !== "/student/list" && (
                <button
                    onClick={e => handleClick(e)}
                    className="border-none outline-none"
                >
                    <ArrowBack className="text-4xl text-icon-default" />
                </button>
            )}
        </div>
    );
}
