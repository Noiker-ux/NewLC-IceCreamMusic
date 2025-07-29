import { URLPattern } from 'next/server';

export function pathTest(patterns: string[], href: string) {
	const pathPatterns = patterns.map(
		(path) => new URLPattern({ pathname: path }),
	);

	return pathPatterns.some((pattern) => pattern.test(href));
}

export function buildHostUrl(path: string) {
	const hostUrl = new URL(path, process.env.NEXT_PUBLIC_DOMAIN!);

	return hostUrl;
}
