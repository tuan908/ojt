/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@reduxjs/toolkit", "react-redux"],
    experimental: {
        scrollRestoration: true
    }
};

export default nextConfig;
