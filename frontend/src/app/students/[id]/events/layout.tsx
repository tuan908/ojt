import Navbar from "@/shared/components/navbar";
import type { LayoutProps } from "@/shared/types";

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center pt-20 pb-6">
                {children}
            </div>
        </div>
    );
}
