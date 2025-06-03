import { TAuthUserSchema } from '@/schema/user.schema';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const routeTypes = ['guest', 'public'] as const;

export type RouteType = (typeof routeTypes)[number];

export const routes: Record<RouteType, string[]> = {
	guest: ['/signin', '/signup', '/confirm', '/recover', '/reset'],
	public: [
		'/signout',
		'/questions',
		'/terms',
		'/distributions',
		'/platforms',
		'/',
	],
};

export const defaultAuthRedirect = '/dashboard';

export const defaultAdminRedirect = '/admin/releases';

export type TSessionData = TAuthUserSchema;

export const sessionCookieName = 'icecream-auth';

export const sessionCookieOptions: Required<
	Omit<
		ResponseCookie,
		| 'value'
		| 'partitioned'
		| 'priority'
		| 'expires'
		| 'name'
		| 'maxAge'
		| 'domain'
	>
> = {
	httpOnly: true,
	sameSite: 'lax',
	secure: true,
	path: '/',
};

export type Required<T extends object> = {
	[K in keyof T]-?: T[K];
};
