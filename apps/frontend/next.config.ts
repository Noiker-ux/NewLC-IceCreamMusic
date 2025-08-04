import { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	cleanDistDir: true,
	allowedDevOrigins: [
		'localhost',
		'www.baconcs.duckdns.org',
		'https://3rs27bxx-3000.inc1.devtunnels.ms',
	],
	experimental: {
		serverActions: {
			allowedOrigins: [
				'localhost',
				'www.icecreammusic.net',
				'3rs27bxx-3000.inc1.devtunnels.ms',
			],
		},
		viewTransition: true,
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
