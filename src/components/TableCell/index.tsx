import {cn} from "@/lib/utils/cn";
import {type ComponentProps} from "react";

type TableCellProps = ComponentProps<"td"> & {
    alignTextCenter?: boolean;
    fontSemibold?: boolean;
    textEllipsis?: boolean;
    classes?: string;
    widthInRem: number;
};

export default function TableCell({
    children,
    alignTextCenter,
    fontSemibold,
    textEllipsis,
    classes,
    widthInRem,
    ...otherProps
}: TableCellProps) {
    return (
        <td
            {...otherProps}
            className={cn(
                "relative border border-table px-4 py-3 align-middle z-10",
                fontSemibold && "font-semibold",
                alignTextCenter && "text-center",
                textEllipsis &&
                    "overflow-hidden whitespace-nowrap text-ellipsis",
                classes && classes
            )}
            style={{maxWidth: `${widthInRem}rem`}}
        >
            {children}
        </td>
    );
}
