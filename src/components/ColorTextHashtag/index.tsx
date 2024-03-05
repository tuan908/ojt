import {type ComponentProps} from "react";

type ColorTextHashtagProps = ComponentProps<"span"> & {color: string};

export default function ColorTextHashtag({
    color,
    children,
    ...otherProps
}: ColorTextHashtagProps) {
    return (
        <span {...otherProps} style={{color}}>
            {children}
        </span>
    );
}
