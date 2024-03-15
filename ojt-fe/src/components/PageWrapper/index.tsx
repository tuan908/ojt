import {cn} from "@/lib/utils/cn";

type PageWrapperProps = Readonly<{children: React.ReactNode; gapY?: boolean}>;

export default function PageWrapper({children, gapY}: PageWrapperProps) {
    return (
        <div
            className={cn(
                "bg-white w-24/25 h-[80dvh] rounded-lg shadow-2xl flex flex-col m-auto",
                gapY && "gap-y-4"
            )}
        >
            {children}
        </div>
    );
}