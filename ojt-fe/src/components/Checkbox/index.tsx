import { Checkbox as MuiCheckbox } from "@mui/material";
import { type ChangeEventHandler } from "react";

export type CheckboxProps = {
    label: string;
    name: string;
    checked: boolean;
    handleChange: ChangeEventHandler<HTMLInputElement>;
};

export function Checkbox({
    label,
    name,
    checked,
    handleChange,
}: CheckboxProps) {
    return (
        <div className="flex items-center">
            <label htmlFor="unconfirmed">{label}</label>
            <MuiCheckbox
                name={name}
                checked={checked}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                onChange={handleChange}
                className="accent-icon-default"
                disableFocusRipple
                disableRipple
            />
        </div>
    );
}
