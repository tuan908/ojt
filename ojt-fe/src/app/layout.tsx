import theme from "@/styles/theme";
import {type LayoutProps} from "@/types";
import {CssBaseline} from "@mui/material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v14-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import type {Metadata} from "next";
import {Noto_Sans_JP} from "next/font/google";
import ReduxProvider from "../providers/ReduxProvider";
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

export default async function RootLayout({children}: LayoutProps) {
    return (
        <html lang="en">
            <body className="text-default w-full h-full min-h-dvh max-w-dvw bg-[#ededed]">
                <ReduxProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <main className={notoSansJp.className}>
                                {children}
                            </main>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
