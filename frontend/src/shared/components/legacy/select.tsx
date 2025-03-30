"use client";

import { menuProps, sx } from "@/shared/constants";
import { cn } from "@/shared/utils";
import {
    MenuItem,
    Select as MuiSelect,
    type SelectChangeEvent as MuiSelectChangeEvent,
    type SelectProps as MuiSelectProps,
} from "@mui/material";
import { type ReactNode } from "react";

export type MuiSelectChangeHandler = (
    event: MuiSelectChangeEvent<string>,
    reactNode: ReactNode
) => void;

export type Option = {
    id: number;
    name: string;
};

type SelectProps = {
    value: MuiSelectProps<string>["value"];
    onChange: MuiSelectChangeHandler;
    label: string;
    options: Option[];
} & Partial<{
    variant: MuiSelectProps["variant"];
    className: MuiSelectProps["className"];
    name: MuiSelectProps["name"];
    suppressContentEditableWarning: MuiSelectProps["suppressContentEditableWarning"];
}>;

export default function LegacySelect({
    label,
    options,
    className,
    suppressContentEditableWarning = true,
    variant = "standard",
    onChange,
    value,
    name,
}: SelectProps) {
    return (
        <MuiSelect
            sx={sx}
            MenuProps={menuProps}
            variant={variant}
            className={cn("w-48", className)}
            suppressContentEditableWarning={suppressContentEditableWarning}
            label={label}
            onChange={onChange}
            value={value}
            name={name}
        >
            <MenuItem value={label} disabled>
                {label}
            </MenuItem>

            {options!?.map(option => (
                <MenuItem
                    key={option.id}
                    value={option.name}
                    disableRipple
                    disableTouchRipple
                >
                    {option.name}
                </MenuItem>
            ))}
        </MuiSelect>
    );
}
