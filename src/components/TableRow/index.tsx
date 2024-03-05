import {ComponentProps} from "react";

type TableRowProps = ComponentProps<"tr"> & {};

export default function TableRow({children, ...otherProps}: TableRowProps) {
    return (
        <tr {...otherProps} className="hover:cursor-pointer">
            {children}
        </tr>
    );
}
