import Navbar from "@/components/Navbar";

export default function Layout({
    children,
}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="pt-20 w-full h-full max-w-dvw min-h-dvh flex flex-col">
            <Navbar />
            <div className="w-full h-full flex-1 flex justify-center items-center bg-[#ededed]">
                {children}
            </div>
        </div>
    );
}
