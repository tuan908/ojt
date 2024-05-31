import {useMemo, type ComponentProps} from "react";

type TextHashtagProps = ComponentProps<"span"> & {
    color: string;
    paddingXInRem?: number;
};

export default function TextHashtag({
    color,
    children,
    paddingXInRem,
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
