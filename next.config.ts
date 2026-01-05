import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    /* config options here */
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'unpkg.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3333',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3333',
            },
        ],
    },
};

export default nextConfig;
