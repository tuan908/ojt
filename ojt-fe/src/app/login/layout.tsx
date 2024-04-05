import {type LayoutProps} from "@/types";

export default function Layout({children}: LayoutProps) {
    return (
        <div
            className="w-full h-full max-w-dvw min-h-dvh flex items-center justify-center bg-cover"
            style={{
                backgroundImage:
                    "url('https://img.freepik.com/premium-vector/back-school-background-style_23-2148593950.jpg?w=1380')",
            }}
        >
            {children}
        </div>
    );
}
