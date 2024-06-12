/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@reduxjs/toolkit", "react-redux"],
    experimental: {
        scrollRestoration: true,
        ppr: true,
        reactCompiler: true,
    },
    compiler: {
        emotion: true
    }
};

export default nextConfig;
