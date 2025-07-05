import { NextRequest, URLPattern } from 'next/server';

export function pathTest(patterns: string[], href: string) {
	const pathPatterns = patterns.map(
		(path) => new URLPattern({ pathname: path }),
	);

	return pathPatterns.some((pattern) => pattern.test(href));
}

export function getRequestHost(headers: Headers) {
	return headers.get('x-forwarded-host');
}

export function buildHostUrl(req: NextRequest) {
	const requestUrl = req.nextUrl.clone();

	const requestHost = getRequestHost(req.headers);

	if (requestHost && !requestHost.includes('localhost')) {
		requestUrl.host = requestHost;
		requestUrl.port = '';
	}

	return requestUrl;
}
