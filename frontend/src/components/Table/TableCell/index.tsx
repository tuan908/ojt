import { cn } from "@/utils";
import { useMemo, type ComponentProps } from "react";

type TableCellVariant = "default" | "header" | "footer";

type TableCellProps = ComponentProps<"td"> & {
    /** Align text center ? */
    textCenter?: boolean;
    /** Font semibold ? */
    fontSemibold?: boolean;
    /** Text ellipsis ? */
    textEllipsis?: boolean;
    /** Additional classes ? */
    classes?: string;
    /** Width in rem ? */
    width?: number;
    /** Cell variant */
    variant?: TableCellVariant;
};

export default function TableCell({
    children,
    textCenter: alignTextCenter,
    fontSemibold,
    textEllipsis,
    classes,
    width,
    variant = "default",
    ...otherProps
}: TableCellProps) {
    const cellClasses = useMemo(() => {
        const baseClasses = [
            "border border-table py-3 align-middle whitespace-nowrap z-0",
            fontSemibold && "font-semibold",
            alignTextCenter && "text-center",
            textEllipsis && "overflow-hidden whitespace-nowrap text-ellipsis",
            variant === "header" && "bg-gray-100 font-bold",
            variant === "footer" && "bg-gray-50 font-medium",
            classes
        ];

        return cn(baseClasses.filter(Boolean).join(" "));
    }, [fontSemibold, alignTextCenter, textEllipsis, classes, variant]);

    const cellStyle = useMemo(() => ({
        width: width ? `${width}rem` : undefined
    }), [width]);

    return (
        <td
            {...otherProps}
            style={cellStyle}
            className={cellClasses}
        >
            {children}
        </td>
    );
}