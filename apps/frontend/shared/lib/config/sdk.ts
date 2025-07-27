import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { IConnection } from 'sdk';

export function createSDKConnection(options: RequestInit): IConnection & {
	options?: RequestInit;
} {
	const headers = Object.fromEntries(
		new Headers(options.headers ?? {}).entries(),
	);

	return {
		host: process.env.API_URL!,
		options,
		headers,
		fetch,
	};
}
