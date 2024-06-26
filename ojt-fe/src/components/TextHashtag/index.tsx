import {useMemo, type ComponentProps} from "react";

type TextHashtagProps = ComponentProps<"span"> & {
    color: string;
    /** Padding X */
    px?: number;
};

export default function TextHashtag({
    color,
    children,
    px,
    ...otherProps
}: TextHashtagProps) {
    const style = useMemo(() => {
        if (!px) {
            return {
                color,
                padding: 0,
            };
        }
        return {
            color,
            padding: `0 ${px}rem 0 ${px}rem`,
        };
    }, [px]);

    return (
        <span {...otherProps} style={style}>
            {children}
        </span>
    );
}
