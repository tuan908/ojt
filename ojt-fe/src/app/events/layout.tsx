import Navbar from "@/components/Navbar";
import type {LayoutProps} from "@/types";

export default function Layout({children}: LayoutProps) {
    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center pt-20 pb-6">
                {children}
            </div>
        </div>
    );
}
