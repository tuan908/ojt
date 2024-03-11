import {type ComponentProps} from "react";

type TableRowProps = ComponentProps<"tr"> & {};

export default function TableRow({children, ...otherProps}: TableRowProps) {
    return (
        <tr
            {...otherProps}
            className="hover:cursor-pointer even:bg-slate-100 hover:bg-slate-200"
        >
            {children}
        </tr>
    );
}
