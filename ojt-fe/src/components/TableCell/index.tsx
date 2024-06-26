import {useMemo, type ComponentProps} from "react";

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
};

export default function TableCell({
    children,
    textCenter: alignTextCenter,
    fontSemibold,
    textEllipsis,
    classes,
    width,
    ...otherProps
}: TableCellProps) {
    const {className, style} = useMemo(() => {
        let base =
            "border border-table py-3 align-middle whitespace-nowrap z-0";
        if (fontSemibold) {
            base += ` font-semibold`;
        }

        if (alignTextCenter) {
            base += ` text-center`;
        }

        if (textEllipsis) {
            base += ` overflow-hidden whitespace-nowrap text-ellipsis`;
        }

        if (classes) {
            base += ` ${classes}`;
        }

        return {
            className: base,
            style: {width: width ? `${width}rem` : 0},
        };
    }, [fontSemibold, alignTextCenter, textEllipsis, classes, width]);

    return (
        <td {...otherProps} style={style} className={className}>
            {children}
        </td>
    );
}
