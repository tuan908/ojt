import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@reduxjs/toolkit", "react-redux"],
    experimental: {
        scrollRestoration: true,
        ppr: true,
        reactCompiler: true,
        optimizeServerReact: true,
        optimizePackageImports: ["react-redux", "@reduxjs/toolkit", "echarts"]
    },
    compiler: {
        emotion: true
    },
    modularizeImports: {
        '@mui/icons-material/?(((\\w*)?/?)*)': {
            transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}'
        }
    }
};

export default nextConfig;
