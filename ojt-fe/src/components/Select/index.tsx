"use client";

import {menuProps, sx} from "@/constants";
import {cn} from "@/utils";
import {
    MenuItem,
    Select as MuiSelect,
    type SelectChangeEvent as MuiSelectChangeEvent,
    type SelectProps as MuiSelectProps,
} from "@mui/material";
import {type ReactNode} from "react";

export type MuiSelectChangeHandler = (
    event: MuiSelectChangeEvent<string>,
    reactNode: ReactNode
) => void;

export type SelectOption = {
    id: number;
    name: string;
};

type SelectProps = {
    value: MuiSelectProps<string>["value"];
    onChange: MuiSelectChangeHandler;
    defaultOption: string;
    options: SelectOption[];
} & Partial<{
    variant: MuiSelectProps["variant"];
    className: MuiSelectProps["className"];
    name: MuiSelectProps["name"];
    suppressContentEditableWarning: MuiSelectProps["suppressContentEditableWarning"];
}>;

export default function Select({
    defaultOption,
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
            label={defaultOption}
            onChange={onChange}
            value={value}
            name={name}
        >
            {!defaultOption ? null : (
                <MenuItem value={defaultOption}>{defaultOption}</MenuItem>
            )}
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
