import {
	callbackCoolieName,
	stateCookieName,
	verifierCookeiName,
} from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { accountSchema, tokensSchema } from '@/shared/lib/oauth/vk';
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
			{ status: 400, headers: request.headers },
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

	const { user } = await functional.v1.auth
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

	const deviceId = requestUrl.searchParams.get('device_id');

	const code = requestUrl.searchParams.get('code');

	const state = requestUrl.searchParams.get('state');

	const cookieState = cookiesStore.get(stateCookieName)?.value;

	const codeVerifier = cookiesStore.get(verifierCookeiName)?.value;

	if (
		!code ||
		!deviceId ||
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
		return NextResponse.json(
			{
				message: 'Invalid tokens oauth response',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const validTokens = tokensResult.data;

	if (validTokens.state !== cookieState) {
		return NextResponse.json(
			{
				message: 'Invalid tokens oauth state',
			},
			{ status: 400, headers: request.headers },
		);
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
		return NextResponse.json(
			{
				message: 'Invalid oauth account response',
			},
			{ status: 400, headers: request.headers },
		);
	}

	const validAccount = accountValidationResult.data.user;

	const tokenExpires = new Date(
		new Date().getTime() + validTokens.expires_in * 1000,
	);

	const linkConnection = createSDKConnection({
		headers: authHeaders,
	});

	const linkResult = await functional.v1.auth.link
		.linkAccount(linkConnection, {
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
			verified: true,
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
