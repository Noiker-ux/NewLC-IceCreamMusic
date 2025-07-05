import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

export const middleware = async function (request: NextRequest) {
	// const { nextUrl } = request;

	// const token = request.cookies.get(sessionCookieName)?.value ?? 'not_token';

	// const { user } = await authClient(['auth']).auth.getUserByToken.query({
	// 	token,
	// });

	// const isAuthorized = !!user;

	// const isGuestPath = pathTest(routes.guest, nextUrl.href);

	// const isPublicPath = pathTest(routes.public, nextUrl.href);

	// console.log(
	// 	'user',
	// 	user,
	// 	'isAuthorized',
	// 	isAuthorized,
	// 	'isGuestRoute',
	// 	isGuestPath,
	// 	'isPublicRoute',
	// 	isPublicPath,
	// );

	// if (isAuthorized && isGuestPath) {
	// 	const defaultRedirectUrl = nextUrl.clone();

	// 	defaultRedirectUrl.pathname = defaultAuthRedirect;

	// 	if (user.isAdmin) {
	// 		defaultRedirectUrl.pathname = defaultAdminRedirect;
	// 	}

	// 	return NextResponse.redirect(defaultRedirectUrl, {
	// 		headers: request.headers,
	// 	});
	// }

	// if (!isGuestPath && !isPublicPath && !isAuthorized) {
	// 	const signInUrl = nextUrl.clone();

	// 	signInUrl.pathname = '/signin';

	// 	return NextResponse.redirect(signInUrl, { headers: request.headers });
	// }

	return NextResponse.next({ request });
};

export const config: MiddlewareConfig = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|_error).*)',
	],
};
