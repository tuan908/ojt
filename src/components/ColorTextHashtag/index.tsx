import {cn} from "@/lib/utils/cn";
import {type ComponentProps} from "react";

type ColorTextHashtagProps = ComponentProps<"span"> & {
    color: string;
    paddingXInRem?: number;
};

export default function ColorTextHashtag({
    color,
    children,
    paddingXInRem,
    ...otherProps
}: ColorTextHashtagProps) {
    return (
        <span
            {...otherProps}
            style={{
                color,
                padding: `0 ${paddingXInRem ?? 0}rem 0 ${paddingXInRem ?? 0}rem`,
            }}
        >
            {children}
        </span>
    );
}
