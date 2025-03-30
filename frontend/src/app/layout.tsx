import ReactQueryProvider from "@/shared/providers/react-query";
import theme from "@/shared/styles/theme";
import { type LayoutProps } from "@/shared/types";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "../shared/providers/redux";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "社会人基礎力",
        template: "%s | 社会人基礎力",
    },
    description: "社会人基礎力",
};

const notoSansJp = Noto_Sans_JP({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["vietnamese", "latin"],
});

export default async function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en">
            <body className="text-default w-full h-full min-h-dvh max-w-dvw bg-[#ededed]">
                <ReactQueryProvider>
                    <ReduxProvider>
                        <AppRouterCacheProvider>
                            <ThemeProvider theme={theme}>
                                <main className={notoSansJp.className}>
                                    {children}
                                </main>
                            </ThemeProvider>
                        </AppRouterCacheProvider>
                    </ReduxProvider>
                </ReactQueryProvider>
                <Toaster />
            </body>
        </html>
    );
}
