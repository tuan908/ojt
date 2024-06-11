"use client";

import {logOut} from "@/app/actions/auth.action";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

export default function LogoutButton() {
    const handleClick = async () => {
        await logOut();
    };

    return (
        <>
            {/* Button Logout */}
            <div
                className="border-x px-2 hover:cursor-pointer"
                onClick={handleClick}
            >
                <PowerSettingsNew
                    className="text-icon-default text-bold"
                    sx={{width: 36, height: 36}}
                />
            </div>
        </>
    );
}
