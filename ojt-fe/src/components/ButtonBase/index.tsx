import {cn} from "@/lib/utils/cn";
import {type ComponentProps} from "react";

type ButtonBaseProps = ComponentProps<"button"> & {
    color?: "confirmed" | "unconfirmed" | "finished";
    classes?: string;
};

export default function OjtButtonBase({
    color,
    children,
    classes,
    ...otherProps
}: ButtonBaseProps) {
    let backgroundColor;
    switch (color) {
        case "unconfirmed":
            backgroundColor = "#33b5e5";
            break;

        case "confirmed":
            backgroundColor = "#ffbb33";
            break;

        case "finished":
            backgroundColor = "#00c851";
            break;

        default:
            break;
    }
    return (
        <button
            {...otherProps}
            style={{backgroundColor}}
            className={cn("border-none outline-none", classes && classes)}
        >
            {children}
        </button>
    );
}
