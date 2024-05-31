import Navbar from "@/components/Navbar";
import type {LayoutProps} from "@/types";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        default: "学生イベント",
        template: "%s | 学生イベント",
    },
    description: "学生イベント",
};

export default async function Layout({children}: LayoutProps) {
    return (
        <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center bg-[#ededed]">
                {children}
            </div>
        </div>
    );
}
