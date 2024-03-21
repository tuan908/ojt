import {type ChangeEventHandler} from "react";

export function Checkbox({
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
        <div className="flex gap-x-4">
            <label htmlFor="unconfirmed">{label}</label>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={handleChange}
            />
        </div>
    );
}
