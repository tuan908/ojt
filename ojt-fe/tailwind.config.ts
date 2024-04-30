import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                default: "#575757",
                "icon-default": "#31bafd",
            },
            borderColor: {
                default: "#333333",
                table: "#dee2e6",
            },
            width: {
                "24/25": "96%",
            },
            zIndex: {
                /* z-index larger than Material UI's drawer - 1300 */
                1301: "1301",
            },
        },
    },
    plugins: [],
};
export default config;
