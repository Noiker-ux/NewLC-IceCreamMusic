import { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	cleanDistDir: true,
	allowedDevOrigins: [
		'localhost',
		'localhost:3000',
		'www.baconcs.duckdns.org',
		'www.icecreammusic.net',
		'3rs27bxx-3000.inc1.devtunnels.ms',
	],
	experimental: {
		serverActions: {
			allowedOrigins: [
				'localhost',
				'localhost:3000',
				'www.baconcs.duckdns.org',
				'www.icecreammusic.net',
				'3rs27bxx-3000.inc1.devtunnels.ms',
			],
		},
		viewTransition: true,
	},
	images: {
		unoptimized: true,
	},
	async redirects() {
			return [
				{
					source: '/dashboard',
					destination: '/dashboard/main/news',
					permanent: true,
				},
				{
					source: '/dashboard/marketing/promo-links',
					destination: '/dashboard/main/news',
					permanent: true,
				}
			];
	},
};

export default nextConfig;
