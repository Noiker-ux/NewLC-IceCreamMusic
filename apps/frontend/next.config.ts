import { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	cleanDistDir: true,
	experimental: {
		serverActions: {
			allowedOrigins: ['localhost'],
		},
		viewTransition: true,
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
