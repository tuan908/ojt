import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  eslint: {ignoreDuringBuilds: true},
  experimental: {
    scrollRestoration: true,
    reactCompiler: true,
    optimizeServerReact: true,
    optimizePackageImports: ['echarts'],
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
