import {useMemo, type ComponentProps} from "react";

type TextHashtagProps = ComponentProps<"span"> & {
    color: string;
    px?: number;
};

export default function TextHashtag({
    color,
    children,
    px: paddingXInRem,
    ...otherProps
}: TextHashtagProps) {
    const style = useMemo(() => {
        if (paddingXInRem) {
            return {
                color,
                padding: `0 ${paddingXInRem}rem 0 ${paddingXInRem}rem`,
            };
        }
        return {
            color,
            padding: 0,
        };
    }, [paddingXInRem]);

    return (
        <span {...otherProps} style={style}>
            {children}
        </span>
    );
}