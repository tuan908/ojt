"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import Avatar from "@mui/material/Avatar";
import {usePathname} from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    return (
        <nav className="w-full shadow-md py-4 pl-10 pr-8 flex justify-between items-center">
            <h1 className="text-[#1f5da3] font-bold text-3xl">社会人基礎カ</h1>
            <div className="flex items-center justify-between gap-x-2">
                {/* Back Button */}
                <div className="pr-2 h-full">
                    {pathname !== "/student/list" && (
                        <ArrowBack className="text-4xl text-[#31bafd]" />
                    )}
                </div>
                {/* Button Logout */}
                <div className="border-x px-2">
                    <PowerSettingsNew className="text-4xl text-[#31bafd] text-bold" />
                </div>
                <div className="pr-2">
                    <Avatar sx={{width: 44, height: 44, bgcolor: "#31bafd"}} />
                </div>

                {/* Username */}
                <div className="">
                    <h1 className="text-2xl font-normal text-[#abb7bc]">
                        こんにちは 純 也
                    </h1>
                    <h1 className="text-[#c3cbcf]">学生</h1>
                </div>
            </div>
        </nav>
    );
}
