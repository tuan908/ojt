import theme from "@/styles/theme";
import {CssBaseline} from "@mui/material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v14-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import type {Metadata} from "next";
import ReduxProvider from "../providers/ReduxProvider";
import "./globals.css";
import {type LayoutProps} from "@/types";

export const metadata: Metadata = {
    title: {
        default: "社会人基礎力",
        template: "%s | 社会人基礎力",
    },
    description: "社会人基礎力",
};

export default async function RootLayout({children}: LayoutProps) {
    return (
        <html lang="en">
            <body className="text-default w-full h-full min-h-dvh max-w-dvw bg-[#ededed]">
                <ReduxProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {children}
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
