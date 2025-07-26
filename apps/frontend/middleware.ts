import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { pathTest } from './shared/lib/url/url';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import {
	defaultAdminRedirect,
	defaultAuthRedirect,
	routes,
} from '@/shared/lib/config/auth';
import { TCheckSessionResponse } from 'sdk/lib/auth/auth.controller';

export const middleware = async function (request: NextRequest) {
	const { nextUrl } = request;

	let user: TCheckSessionResponse['user'] | null = null;

	const isGuestPath = pathTest(routes.guest, nextUrl.href);

	const isPublicPath = pathTest(routes.public, nextUrl.href);

	const sessionToken = await request.cookies.get('icecream-auth')?.value;

	if (!!sessionToken) {
		const authHeaders = new Headers();

		authHeaders.set('Authorization', sessionToken);

		const connecttion = createSDKConnection({
			headers: authHeaders,
		});

		const checkTokenResult = await functional.v1.auth
			.checkSessionToken(connecttion)
			.catch(() => ({
				user: null,
			}));

		user = checkTokenResult.user;
	}

	if (!!user && isGuestPath) {
		const defaultRedirectUrl = nextUrl.clone();

		defaultRedirectUrl.pathname = defaultAuthRedirect;

		if (user.isAdmin) {
			defaultRedirectUrl.pathname = defaultAdminRedirect;
		}

		return NextResponse.redirect(defaultRedirectUrl, {
			headers: request.headers,
		});
	}

	if (!isGuestPath && !isPublicPath && !user) {
		const signInUrl = nextUrl.clone();

		signInUrl.pathname = 'auth/signin';

		return NextResponse.redirect(signInUrl, { headers: request.headers });
	}

	return NextResponse.next({ request });
};

export const config: MiddlewareConfig = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|_error|assets).*)',
	],
};
