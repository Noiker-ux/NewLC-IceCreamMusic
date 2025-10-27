import {
	callbackCoolieName,
	stateCookieName,
	verifierCookeiName,
} from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { accountSchema, tokensSchema } from '@/shared/lib/oauth/yandex';
import { buildHostUrl } from '@/shared/lib/url/url';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { functional } from 'sdk';

export async function GET(request: NextRequest) {
	const requestUrl = buildHostUrl(
		request.nextUrl.pathname + request.nextUrl.search,
	);

	const cookiesStore = await cookies();

	const sessionToken = cookiesStore.get('session-token')?.value;

	if (!sessionToken) {
		return NextResponse.json(
			{
				message: 'Invalid session token',
			},
			{ status: 400 },
		);
	}

	const authHeaders = new Headers();

	authHeaders.set('Authorization', `${sessionToken}`);

	const authConnection = createSDKConnection({
		headers: authHeaders,
		next: {
			tags: ['authorization'],
			revalidate: 5,
		},
	});

	const { user } = await functional.api.v1.auth
		.checkSessionToken(authConnection)
		.catch(() => ({ user: null }));

	if (!user) {
		return NextResponse.json(
			{
				message: 'Invalid auth flow result',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const callbackUrl = cookiesStore.get(callbackCoolieName)?.value;

	if (!callbackUrl) {
		return NextResponse.json(
			{
				message: 'Invalid callback url',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const code = requestUrl.searchParams.get('code');

	const state = requestUrl.searchParams.get('state');

	const cookieState = cookiesStore.get(stateCookieName)?.value;

	const codeVerifier = cookiesStore.get(verifierCookeiName)?.value;

	if (
		!code ||
		!state ||
		!cookieState ||
		!codeVerifier ||
		state !== cookieState
	) {
		return NextResponse.json(
			{
				message: 'Invalid oauth result query',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const tokenHeaders = new Headers();

	tokenHeaders.set(
		'Authorization',
		`Basic ${Buffer.from(`${process.env.AUTH_YANDEX_ID}:${process.env.AUTH_YANDEX_SECRET}`).toString('base64')}`,
	);
	tokenHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

	const tokensObject = {
		grant_type: 'authorization_code',
		code_verifier: codeVerifier,
		code,
	};

	const tokensBody = new URLSearchParams(
		Object.entries(tokensObject),
	).toString();

	const tokensResponse = await fetch('https://oauth.yandex.ru/token', {
		method: 'POST',
		body: tokensBody,
		headers: tokenHeaders,
	});

	const tokensData = await tokensResponse.json();

	const tokensResult = tokensSchema.safeParse(tokensData);

	if (!tokensResult.success) {
		return NextResponse.json(
			{
				message: 'Invalid tokens oauth response',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const validTokens = tokensResult.data;

	const accountHeaders = new Headers();

	accountHeaders.set('Authorization', `OAuth ${validTokens.access_token}`);

	const accountResponse = await fetch('https://login.yandex.ru/info', {
		headers: accountHeaders,
	});

	const userAccount = await accountResponse.json();

	const accountValidationResult = accountSchema.safeParse(userAccount);

	if (!accountValidationResult.success) {
		return NextResponse.json(
			{
				message: 'Invalid oauth account response',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const validAccount = accountValidationResult.data;

	const tokenExpires = new Date(
		new Date().getTime() + validTokens.expires_in * 1000,
	);

	const avatarUrl = new URL(
		`${validAccount.default_avatar_id}/islands-200`,
		'https://avatars.yandex.net/get-yapic',
	);

	const linkConnection = createSDKConnection({
		headers: authHeaders,
	});

	const linkResult = await functional.api.v1.auth.link
		.linkAccount(linkConnection, {
			provider: 'yandex',
			providerAccountId: validAccount.id,
			accessToken: validTokens.access_token,
			refreshToken: validTokens.refresh_token,
			expiresAt: tokenExpires.toISOString(),
			tokenType: validTokens.token_type,
			scope: validTokens.scope ?? '',
			email: validAccount.default_email,
			name: validAccount.display_name,
			avatar: avatarUrl.href,
			verified: true,
			phone: validAccount.default_phone?.number,
		})
		.catch(() => ({ success: false as const }));

	if (!linkResult.success) {
		return NextResponse.json(
			{
				message: 'Invalid link account result',
			},
			{ status: 400, headers: request.headers },
		);
	}

	cookiesStore.delete(verifierCookeiName);

	cookiesStore.delete(stateCookieName);

	cookiesStore.delete(callbackCoolieName);

	return NextResponse.redirect(callbackUrl, { headers: request.headers });
}
