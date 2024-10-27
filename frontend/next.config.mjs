/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8082/:path*', // 将 /api/* 的请求代理到 NestJS 后端
        },
      ];
    },
  };
  
  export default nextConfig;
  