import {useMemo, type ComponentProps} from "react";

type TableHeadProps = ComponentProps<"th"> & {
    bgColor?: string;
    classes?: string;
    /** width in rem */
    width?: number;
};

export default function TableHead({
    bgColor,
    classes,
    width,
    children,
}: TableHeadProps) {
    const {className, style} = useMemo(() => {
        let base =
            "border border-table text-center px-4 py-2 whitespace-nowrap";

        if (classes) {
            base += ` ${classes}`;
        }

        return {
            className: base,
            style: {
                backgroundColor: bgColor,
                width: width ? `${width}rem` : 0,
            },
        };
    }, [classes, bgColor, width]);

    return (
        <th className={className} style={style}>
            {children}
        </th>
    );
}
