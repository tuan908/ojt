import Utils from "@/utils";
import {type ComponentProps} from "react";

type ButtonProps = ComponentProps<"button"> & {
    color?: "confirmed" | "unconfirmed" | "finished";
    classes?: string;
};

export default function Button({
    color,
    children,
    classes,
    ...otherProps
}: ButtonProps) {
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
            className={Utils.cn("border-none outline-none", classes && classes)}
        >
            {children}
        </button>
    );
}
