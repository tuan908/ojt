import {cn} from "@/lib/utils";

type CardProps = {
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
export default function OjtCard({
    width,
    height,
    fullWidth,
    children,
    backgroundColor = "#ffffff",
    paddingX,
    paddingY,
    flex,
}: CardProps) {
    return (
        <div
            className={cn(
                "shadow-2xl rounded-2xl",
                paddingX ?? "px-4",
                paddingY ?? "py-6",
                flex && "flex flex-col"
            )}
            style={{
                width: fullWidth ? "100%" : `${width ?? 0}rem`,
                height: `${height}rem`,
                backgroundColor,
            }}
        >
            {children}
        </div>
    );
}
