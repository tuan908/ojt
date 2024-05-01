import {Checkbox} from "@mui/material";
import {type ChangeEventHandler} from "react";

export function OjtCheckbox({
    label,
    name,
    checked,
    handleChange,
}: {
    label: string;
    name: string;
    checked: boolean;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <div className="flex items-center">
            <label htmlFor="unconfirmed">{label}</label>
            <Checkbox
                name={name}
                checked={checked}
                sx={{"& .MuiSvgIcon-root": {fontSize: 20}}}
                onChange={handleChange}
                className="accent-icon-default"
                disableFocusRipple
                disableRipple
            />
        </div>
    );
}
