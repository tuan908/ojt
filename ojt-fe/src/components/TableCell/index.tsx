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

export default function TableCell(props: TableCellProps) {
    const {
        children,
        textCenter: alignTextCenter,
        fontSemibold,
        textEllipsis,
        classes,
        width,
        ...otherProps
    } = props;

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

        if (classes) {
            base += ` ${classes}`;
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
