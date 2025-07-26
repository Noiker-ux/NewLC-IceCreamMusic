import { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	cleanDistDir: true,
	allowedDevOrigins: ['localhost', 'www.baconcs.duckdns.org'],
	experimental: {
		serverActions: {
			allowedOrigins: ['www.icecreammusic.net'],
		},
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
