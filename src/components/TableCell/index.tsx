import {cn} from "@/lib/utils/cn";
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
            className={cn(
                "relative border bg-white border-table px-4 py-3 align-middle z-10",
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
