import Utils from "@/utils";
import {type ComponentProps} from "react";

type TableCellProps = ComponentProps<"td"> & {
    alignTextCenter?: boolean;
    fontSemibold?: boolean;
    textEllipsis?: boolean;
    classes?: string;
};

export default function TableCell({
    children,
    alignTextCenter,
    fontSemibold,
    textEllipsis,
    classes,
    ...otherProps
}: TableCellProps) {
    return (
        <td
            {...otherProps}
            className={Utils.cn(
                "relative border border-table py-3 align-middle z-10 whitespace-nowrap",
                fontSemibold && "font-semibold",
                alignTextCenter && "text-center",
                textEllipsis &&
                    "overflow-hidden whitespace-nowrap text-ellipsis",
                classes && classes
            )}
        >
            {children}
        </td>
    );
}
