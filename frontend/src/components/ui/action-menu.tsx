"use client";

import { logOut } from "@/app/actions/auth";
import json from "@/i18n/locales/ja.json";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList
} from "@mui/material";
import { CircleUser, LogOut } from "lucide-react";
import { useState } from "react";

export default function ActionMenu({ name }: { name?: string }) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logOut();
    };

    return (
        <>
            <button className="pr-2 cursor-pointer" onClick={handleClick}>
                <CircleUser className="text-icon-default" size={48} />
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuList dense>
                    <MenuItem onClick={handleClose}>
                        {name}としてサインイン
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogOut className="text-icon-default" size={24} />
                        </ListItemIcon>
                        <ListItemText>{json.common.logout}</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}
