import {useMemo, type ComponentProps} from "react";

type TableCellProps = ComponentProps<"td"> & {
    alignTextCenter?: boolean;
    fontSemibold?: boolean;
    textEllipsis?: boolean;
    classes?: string;
    /** width in rem */
    width?: number;
};

export default function TableCell({
    children,
    alignTextCenter,
    fontSemibold,
    textEllipsis,
    classes,
    width,
    ...otherProps
}: TableCellProps) {
    const className = useMemo(() => {
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

        return base;
    }, [fontSemibold, alignTextCenter, textEllipsis, classes]);

    const style = useMemo(() => ({width: width ? `${width}rem` : 0}), [width]);

    return (
        <td {...otherProps} style={style} className={className}>
            {children}
        </td>
    );
}
