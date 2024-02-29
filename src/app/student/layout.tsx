import Navbar from "@/components/navbar";

export default function Layout({
    children,
}: Readonly<{children: React.ReactNode}>) {
    return (
        <div className="w-full h-full max-w-dvw min-h-dvh">
            <Navbar />
            {children}
        </div>
    );
}
