import {
	callbackCoolieName,
	sessionCookieName,
	sessionCookieOptions,
	stateCookieName,
	verifierCookeiName,
} from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { buildHostUrl } from '@/shared/lib/url/url';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { functional } from 'sdk';
import { z } from 'zod';

const tokensSchema = z.object({
	refresh_token: z.string(),
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	scope: z.string().optional(),
});

const accountSchema = z.object({
	id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	display_name: z.string(),
	default_email: z.string(),
	sex: z.string(),
	birthday: z.string(),
	default_avatar_id: z.string(),
	is_avatar_empty: z.boolean(),
	default_phone: z
		.object({
			id: z.number(),
			number: z.string(),
		})
		.optional(),
});

const connection = createSDKConnection({});

export async function GET(request: NextRequest) {
	const requestUrl = buildHostUrl(request);

	const badRedirectUrl = requestUrl.clone();

	badRedirectUrl.search = '';

	badRedirectUrl.pathname = '/auth/signin';

	const badRedirect = NextResponse.redirect(badRedirectUrl, {
		headers: request.headers,
	});

	const code = requestUrl.searchParams.get('code');

	const state = requestUrl.searchParams.get('state');

	const cookiesStore = await cookies();

	const cookieState = cookiesStore.get(stateCookieName)?.value;

	const codeVerifier = cookiesStore.get(verifierCookeiName)?.value;

	if (
		!code ||
		!state ||
		!cookieState ||
		!codeVerifier ||
		state !== cookieState
	) {
		return badRedirect;
	}

	requestUrl.search = '';

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
		return badRedirect;
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
		return badRedirect;
	}

	const validAccount = accountValidationResult.data;

	const tokenExpires = new Date(
		new Date().getTime() + validTokens.expires_in * 1000,
	);

	const avatarUrl = new URL(
		`${validAccount.default_avatar_id}/islands-200`,
		'https://avatars.yandex.net/get-yapic',
	);

	const tokenRes = await functional.v1.auth.oauth.OAuthSignin(connection, {
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
	});

	cookiesStore.delete(verifierCookeiName);

	cookiesStore.delete(stateCookieName);

	const callbackUrl = cookiesStore.get(callbackCoolieName)?.value;

	cookiesStore.delete(callbackCoolieName);

	cookiesStore.set(sessionCookieName, tokenRes.session_token, {
		...sessionCookieOptions,
		maxAge: 60 * 60 * 24 * 30,
	});

	if (callbackUrl) {
		return NextResponse.redirect(callbackUrl, { headers: request.headers });
	}

	const goodRedirectUrl = badRedirectUrl.clone();

	goodRedirectUrl.pathname = '/';

	return NextResponse.redirect(goodRedirectUrl, { headers: request.headers });
}
