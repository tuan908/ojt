import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@reduxjs/toolkit', 'react-redux'],
  experimental: {
    scrollRestoration: true,
    reactCompiler: true,
    optimizeServerReact: true,
    optimizePackageImports: ['react-redux', '@reduxjs/toolkit', 'echarts'],
    authInterrupts: true,
  },
  compiler: {
    emotion: true,
  },
  modularizeImports: {
    '@mui/icons-material/?(((\\w*)?/?)*)': {
      transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}',
    },
  },
};

export default nextConfig;
