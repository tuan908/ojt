import {ComponentProps} from "react";

type TableHeadProps = ComponentProps<"th">;

export default function TableHead({children}: TableHeadProps) {
    return (
        <th className="border border-table text-center px-4 py-2">
            {children}
        </th>
    );
}
