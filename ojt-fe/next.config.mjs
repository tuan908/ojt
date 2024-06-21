/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@reduxjs/toolkit", "react-redux"],
    experimental: {
        scrollRestoration: true,
        ppr: true,
        reactCompiler: true,
        optimizeServerReact: true,
        optimizePackageImports: ["react-redux", "@reduxjs/toolkit", "@mui/material", "@mui/icons-material", "echarts"]
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
