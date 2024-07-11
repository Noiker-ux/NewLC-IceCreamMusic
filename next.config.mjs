/** @type {import('next').NextConfig} */
export function webpack(config) {
	config.module.rules.push({
		test: /\.svg$/i,
		use: ['@svgr/webpack'],
	});
	return config;
}
