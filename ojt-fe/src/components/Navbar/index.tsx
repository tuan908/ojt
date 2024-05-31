import {getValidToken} from "@/app/actions/event";
import {OjtRoute, OjtUserRole} from "@/constants";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import BackButton from "./BackButton";
import LogoutButton from "./LogOut";
import Sidebar from "./Sidebar";
import UserInfo from "./UserInfo";

const avatarSx = {
    width: 44,
    height: 44,
    bgcolor: "#31bafd",
};

export default async function Navbar() {
    const auth = await getValidToken();
    const href =
        auth?.role !== OjtUserRole.Student
            ? OjtRoute.StudentList
            : `/student/${auth?.code}`;
    return (
        <nav className="w-full py-2 px-4 flex justify-between items-center z-50 fixed top-0 left-0 shadow-md bg-white">
            <div className="flex flex-row gap-x-4 items-center">
                <Sidebar auth={auth} />
                <Link className="text-[#1f5da3] font-bold text-2xl" href={href}>
                    社会人基礎力
                </Link>
            </div>
            <div className="hidden items-center justify-between gap-x-2 lg:flex">
                {/* Back Button */}
                <BackButton />

                <LogoutButton />

                <div className="pr-2">
                    <Avatar sx={avatarSx} />
                </div>

                {/* Username */}
                <UserInfo />
            </div>
        </nav>
    );
}
