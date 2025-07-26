import { createSDKConnection } from '@/shared/lib/config/sdk';
import { buildHostUrl } from '@/shared/lib/url/url';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { functional } from 'sdk';
import { z } from 'zod';

const tokensSchema = z.object({
	refresh_token: z.string(),
	access_token: z.string(),
	id_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	user_id: z.number(),
	state: z.string(),
	scope: z.string(),
});

const accountSchema = z.object({
	user: z.object({
		user_id: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		avatar: z.string(),
		email: z.string(),
		sex: z.number(),
		verified: z.boolean(),
		birthday: z.string(),
	}),
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

	const deviceId = requestUrl.searchParams.get('device_id');

	const code = requestUrl.searchParams.get('code');

	const state = requestUrl.searchParams.get('state');

	const cookiesStore = await cookies();

	const cookieState = cookiesStore.get('example-state')?.value;

	const codeVerifier = cookiesStore.get('example-verifier')?.value;

	if (
		!code ||
		!deviceId ||
		!state ||
		!cookieState ||
		!codeVerifier ||
		state !== cookieState
	) {
		return badRedirect;
	}

	requestUrl.search = '';

	const tokensObject = {
		grant_type: 'authorization_code',
		code_verifier: codeVerifier,
		code,
		state,
		client_id: process.env.AUTH_VK_ID!,
		device_id: deviceId,
		redirect_uri: requestUrl.href,
	};

	const tokensBody = new URLSearchParams(
		Object.entries(tokensObject),
	).toString();

	const tokensResponse = await fetch('https://id.vk.com/oauth2/auth', {
		method: 'POST',
		body: tokensBody,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	const tokensData = await tokensResponse.json();

	const tokensResult = tokensSchema.safeParse(tokensData);

	if (!tokensResult.success) {
		return badRedirect;
	}

	const validTokens = tokensResult.data;

	if (validTokens.state !== cookieState) {
		return badRedirect;
	}

	const accountObject = {
		client_id: process.env.AUTH_VK_ID!,
		access_token: validTokens.access_token,
	};

	const accountBody = new URLSearchParams(
		Object.entries(accountObject),
	).toString();

	const accountResponse = await fetch('https://id.vk.com/oauth2/user_info', {
		method: 'POST',
		body: accountBody,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	const userAccount = await accountResponse.json();

	const accountValidationResult = accountSchema.safeParse(userAccount);

	if (!accountValidationResult.success) {
		return badRedirect;
	}

	const validAccount = accountValidationResult.data.user;

	const tokenExpires = new Date(
		new Date().getTime() + validTokens.expires_in * 1000,
	);

	const session = await functional.v1.auth.oauth
		.OAuthSignin(connection, {
			providerAccountId: validAccount.user_id,
			provider: 'vk',
			email: validAccount.email,
			tokenType: validTokens.token_type,
			accessToken: validTokens.access_token,
			refreshToken: validTokens.refresh_token,
			expiresAt: tokenExpires.toISOString(),
			scope: validTokens.scope,
			name: `${validAccount.first_name} ${validAccount.last_name}`,
			avatar: validAccount.avatar,
			verified: validAccount.verified,
		})
		.catch((e) => console.error(new Date().toISOString() + ' ' + e.message));

	if (!session) {
		return badRedirect;
	}

	cookiesStore.delete('icecream-vk-verifier');

	cookiesStore.delete('icecream-vk-state');

	const callbackUrl = cookiesStore.get('icecream-callback')?.value;

	cookiesStore.delete('icecream-callback');

	cookiesStore.delete('icecream-callback');

	cookiesStore.set('icecream-auth', session.session_token, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
	});

	if (callbackUrl) {
		return NextResponse.redirect(callbackUrl, { headers: request.headers });
	}

	const goodRedirectUrl = badRedirectUrl.clone();

	goodRedirectUrl.pathname = '/dashboard';

	return NextResponse.redirect(goodRedirectUrl, { headers: request.headers });
}
