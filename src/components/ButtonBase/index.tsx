import {type ComponentProps} from "react";

type ButtonBaseProps = ComponentProps<"button"> & {
    color: "confirmed" | "unconfirmed" | "finished";
};

export default function ButtonBase({
    color,
    children,
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
        <button {...otherProps} style={{backgroundColor}}>
            {children}
        </button>
    );
}
