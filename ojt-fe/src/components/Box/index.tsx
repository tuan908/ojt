import {useMemo} from "react";

type BoxProps = {
    width?: number;
    height: number;
    backgroundColor?: string;
    children: React.ReactNode;
    paddingX?: string;
    paddingY?: string;
    fullWidth?: boolean;
    flex?: boolean;
};

/**
 * Card Base
 * @param width width in rem
 * @param height height in rem
 * @param backgroundColor backgroundColor
 */
export default function Box({
    width,
    height,
    fullWidth,
    children,
    backgroundColor = "#ffffff",
    paddingX,
    paddingY,
    flex,
}: BoxProps) {
    const className = useMemo(() => {
        let base = "shadow-2xl rounded-2xl";
        if (paddingX) {
            base += " px-4";
        }

        if (paddingY) {
            base += " py-6";
        }

        if (flex) {
            base += "flex flex-col";
        }

        return base;
    }, [paddingX, paddingY, flex]);

    const style = useMemo(() => {
        if (fullWidth) {
            return {
                width: "100%",
                height: `${height}rem`,
                backgroundColor,
            };
        }

        if (width) {
            return {
                width: `${width}rem`,
                height: `${height}rem`,
                backgroundColor,
            };
        }

        return {
            width: `0rem`,
            height: `${height}rem`,
            backgroundColor,
        };
    }, [backgroundColor, fullWidth, height, width]);

    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
}
