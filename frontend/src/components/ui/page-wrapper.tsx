import { cn } from "@/lib/utils";
import { useMemo, type ReactNode } from "react";

type PageWrapperProps = Readonly<{ children: ReactNode; gapY?: boolean }>;

export default function PageWrapper({ children, gapY }: PageWrapperProps) {
    const className = useMemo(() => {
        let base =
            "bg-white w-11/12 lg:w-24/25 h-[76dvh] rounded-lg shadow-2xl flex flex-col m-auto";
        if (gapY) {
            return cn(base, "gap-y-4");
        }
        return base;
    }, [gapY]);

    return <div className={className}>{children}</div>;
}
