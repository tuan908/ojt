"use client";

import {OjtRoute, OjtUserRole} from "@/constants";
import {useAuth} from "@/lib/hooks/useAuth";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import BackButton from "./BackButton";
import LogoutButton from "./LogOut";
import UserInfo from "./UserInfo";

export default function Navbar() {
    const {auth} = useAuth();
    const href =
        auth?.role !== OjtUserRole.Student
            ? OjtRoute.StudentList
            : `/student/${auth?.code}`;
    return (
        <nav className="w-full py-2 px-6 flex justify-between items-center z-50 fixed top-0 left-0 shadow-md bg-white">
            <Link className="text-[#1f5da3] font-bold text-2xl" href={href}>
                社会人基礎力
            </Link>
            <div className="flex items-center justify-between gap-x-2">
                {/* Back Button */}
                <BackButton />

                <LogoutButton />

                <div className="pr-2">
                    <Avatar sx={{width: 44, height: 44, bgcolor: "#31bafd"}} />
                </div>

                {/* Username */}
                <UserInfo />
            </div>
        </nav>
    );
}
