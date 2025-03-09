"use client";

import { logOut } from "@/app/actions/auth";
import json from "@/i18n/jp.json";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import Tooltip from "@mui/material/Tooltip";

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
                <Tooltip title={json.common.logout}>
                    <PowerSettingsNew
                        className="text-icon-default text-bold"
                        sx={{ width: 36, height: 36 }}
                    />
                </Tooltip>
            </div>
        </>
    );
}
