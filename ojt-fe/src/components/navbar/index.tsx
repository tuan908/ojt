import Avatar from "@mui/material/Avatar";
import BackButton from "./BackButton";
import LogoutButton from "./LogOut";
import UserInfo from "./UserInfo";

export default async function Navbar() {
    return (
        <nav className="w-full py-4 pl-10 pr-8 flex justify-between items-center z-50 fixed top-0 left-0 shadow-md bg-white">
            <h1 className="text-[#1f5da3] font-bold text-3xl">社会人基礎力</h1>
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
