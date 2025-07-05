import { buildHostUrl } from '@/shared/lib/url/url';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { db } from 'db';
import * as schema from 'db/schema';
import { createSession, generateToken } from '@/features/auth/lib/session';
import { eq } from 'drizzle-orm';

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

	const session = await db.transaction(async (sessionTx) => {
		const account = await sessionTx.transaction(async (accountTx) => {
			const existingAccount = await accountTx.query.accounts.findFirst({
				with: { user: true },
				where: (acc, { eq }) => eq(acc.providerAccountId, validAccount.user_id),
			});

			if (!existingAccount) {
				const user = await accountTx.transaction(async (userTx) => {
					const existingUser = await userTx.query.users.findFirst({
						where: (usr, { eq }) => eq(usr.email, validAccount.email),
					});

					if (existingUser) {
						return existingUser;
					}

					const newUser = (
						await userTx
							.insert(schema.users)
							.values({
								email: validAccount.email,
								emailVerified: new Date(),
								name: `${validAccount.first_name} ${validAccount.last_name}`,
								avatar: validAccount.avatar,
							})
							.returning()
					)[0];

					return newUser;
				});

				return (
					await accountTx
						.insert(schema.accounts)
						.values({
							userId: user.id,
							providerAccountId: validAccount.user_id,
							type: 'oauth',
							provider: 'vk',
							access_token: validTokens.access_token,
							refresh_token: validTokens.refresh_token,
							expires_at: tokenExpires,
							token_type: validTokens.token_type,
							scope: validTokens.scope,
						})
						.returning()
				)[0];
			}

			return (
				await accountTx
					.update(schema.accounts)
					.set({
						access_token: validTokens.access_token,
						refresh_token: validTokens.refresh_token,
						expires_at: tokenExpires,
					})
					.where(
						eq(
							schema.accounts.providerAccountId,
							existingAccount.providerAccountId,
						),
					)
					.returning()
			)[0];
		});

		const sessionToken = await generateToken();

		const session = await createSession(sessionToken, account.userId);

		return (
			await sessionTx.insert(schema.sessions).values(session).returning()
		)[0];
	});

	cookiesStore.delete('icecream-vk-verifier');

	cookiesStore.delete('icecream-vk-state');

	const callbackUrl = cookiesStore.get('icecream-callback')?.value;

	cookiesStore.delete('icecream-callback');

	cookiesStore.set('icecream-auth', session.sessionToken, {
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
