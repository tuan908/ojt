import Navbar from "@/components/Navbar";
import type {LayoutProps} from "@/types";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "追跡",
};

export default async function Layout({children}: LayoutProps) {
    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center bg-[#ededed]">
                <div className="w-full px-6 h-full bg-transparent flex flex-wrap gap-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
