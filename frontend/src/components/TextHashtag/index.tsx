import { useMemo, type ComponentProps } from "react";

type TextHashtagProps = ComponentProps<"span"> & {
    color: string;
    /** Padding X (in rem) */
    px?: number;
};

export default function TextHashtag({
    color,
    children,
    px = 0, // ✅ Set default to avoid undefined
    ...otherProps
}: TextHashtagProps) {
    const style = useMemo(() => ({
        color,
        padding: `0 ${px}rem`, // ✅ Simplified padding syntax
    }), [color, px]); // ✅ Added `color` as a dependency

    return (
        <span {...otherProps} style={style}>
            {children}
        </span>
    );
}