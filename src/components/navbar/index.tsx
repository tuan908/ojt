import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import Avatar from "@mui/material/Avatar";
import BackButton from "./BackButton";
import UserInfo from "./UserInfo";

export default async function Navbar() {
    return (
        <nav className="w-full py-4 pl-10 pr-8 flex justify-between items-center z-[1300] fixed top-0 left-0 shadow-md bg-white">
            <h1 className="text-[#1f5da3] font-bold text-3xl">
                Skill Management System
            </h1>
            <div className="flex items-center justify-between gap-x-2">
                {/* Back Button */}
                <BackButton />

                {/* Button Logout */}
                <div className="border-x px-2">
                    <PowerSettingsNew
                        className="text-icon-default text-bold"
                        sx={{width: 36, height: 36}}
                    />
                </div>
                <div className="pr-2">
                    <Avatar sx={{width: 44, height: 44, bgcolor: "#31bafd"}} />
                </div>

                {/* Username */}
                <UserInfo />
            </div>
        </nav>
    );
}
