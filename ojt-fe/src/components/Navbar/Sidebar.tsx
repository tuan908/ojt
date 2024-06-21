"use client";

import useInfo from "@/hooks/useInfo";
import {type JwtPayload} from "@/lib/auth";
import EventIcon from "@mui/icons-material/Event";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {useState} from "react";
import json from "@/i18n/jp.json";

type SidebarProps = {
    auth?: JwtPayload;
};

export default function Sidebar({auth}: SidebarProps) {
    const {fullName, role} = useInfo(auth);

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <button className="block lg:hidden" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{color: "#1f5da3", fontSize: "2rem"}} />
            </button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <Box
                    sx={{width: 250}}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                >
                    <div className="flex flex-row gap-x-4 items-center py-4 px-2 bg-blue-400 text-white">
                        <Avatar />
                        <div>
                            <h1 className="text-base font-normal">
                                {json.common.hello}
                                <span className="font-semibold">
                                    {fullName}
                                </span>
                            </h1>
                            <h1 className="text-base font-semibold">{role}</h1>
                        </div>
                    </div>
                    <Divider />
                    <List>
                        {["イベンド"].map((text, _) => {
                            return (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <EventIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
