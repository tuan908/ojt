import {ComponentProps} from "react";

type TableHeadProps = ComponentProps<"th"> & {widthInRem: number};

export default function TableHead({children, widthInRem}: TableHeadProps) {
    return (
        <th
            className="border border-table text-center px-4 py-2"
            style={{width: `${widthInRem}rem`}}
        >
            {children}
        </th>
    );
}
