import {cn} from "@/lib/utils/cn";
import {type ComponentProps} from "react";

type TableCellProps = ComponentProps<"td"> & {
    alignTextCenter?: boolean;
    fontSemibold?: boolean;
    textEllipsis?: boolean;
};

export default function TableCell({
    children,
    alignTextCenter,
    fontSemibold,
    textEllipsis,
    ...otherProps
}: TableCellProps) {
    return (
        <td
            {...otherProps}
            className={cn(
                "border bg-white border-table px-4 py-3 align-middle",
                fontSemibold && "font-semibold",
                alignTextCenter && "text-center",
                textEllipsis &&
                    "overflow-hidden whitespace-nowrap text-ellipsis"
            )}
        >
            {children}
        </td>
    );
}
