import {useMemo, type ComponentProps} from "react";

type TableHeadProps = ComponentProps<"th"> & {
    sticky?: boolean;
    bgColor?: string;
    classes?: string;
    /** width in rem */
    width?: number;
};

export default function TableHead({
    sticky,
    bgColor,
    classes,
    width,
    children,
}: TableHeadProps) {
    const className = useMemo(() => {
        let base =
            "border border-table text-center px-4 py-2 whitespace-nowrap";
        if (sticky) {
            base += ` sticky top-0 z-10`;
        }

        if (classes) {
            base += ` ${classes}`;
        }

        return base;
    }, [sticky]);

    const style = useMemo(
        () => ({
            backgroundColor: bgColor,
            width: width ? `${width}rem` : 0,
        }),
        [width]
    );

    return (
        <th className={className} style={style}>
            {children}
        </th>
    );
}
