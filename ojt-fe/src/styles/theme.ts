"use client";

import {createTheme} from "@mui/material/styles";
import {Noto_Sans_JP} from "next/font/google";

const notoSansJp = Noto_Sans_JP({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["vietnamese", "latin"],
});

const theme = createTheme({
    typography: {
        fontFamily: notoSansJp.style.fontFamily,
    },
});

export default theme;
