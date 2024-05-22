import Navbar from "@/components/navbar";
import type {LayoutProps} from "@/types";

export default function Layout({children}: LayoutProps) {
    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center bg-[#ededed]">
                <div className="w-24/25 h-full bg-transparent flex flex-wrap gap-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
