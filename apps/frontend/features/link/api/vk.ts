'use server';

import {
	callbackCoolieName,
	sessionCookieOptions,
	stateCookieName,
	verifierCookeiName,
} from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { generateCodeVerifier, generateState } from 'arctic';
import { createS256CodeChallenge } from 'arctic/dist/oauth2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { functional } from 'sdk';

export async function linkVk(currentPath: string) {
	const state = generateState();

	const codeVerifier = await generateCodeVerifier();

	const scopes = ['email', 'phone', 'vkid.personal_info'];

	const cookiesStore = await cookies();

	const sessionToken = cookiesStore.get('session_token')?.value;

	if (!sessionToken)
		return {
			success: false as const,
			error: 'Необходима авторизация',
		};

	const authHeaders = new Headers();

	authHeaders.set('Authorization', `${sessionToken}`);

	const connectionWithAuth = createSDKConnection({
		headers: authHeaders,
		next: {
			tags: ['authorization'],
			revalidate: 5,
		},
	});

	const { user } = await functional.v1.auth
		.checkSessionToken(connectionWithAuth)
		.catch(() => ({ user: null }));

	if (!user) {
		return {
			success: false as const,
			error: 'Пользователь не авторизован',
		};
	}

	const redirectUrl = new URL(
		'/api/auth/link/vk',
		process.env.NEXT_PUBLIC_DOMAIN!,
	);

	const callbackUrl = new URL(currentPath, redirectUrl);

	cookiesStore.set(stateCookieName, state, {
		...sessionCookieOptions,
		maxAge: 60 * 10,
	});

	cookiesStore.set(verifierCookeiName, codeVerifier, {
		...sessionCookieOptions,
		maxAge: 60 * 10,
	});

	cookiesStore.set(callbackCoolieName, callbackUrl.href, {
		...sessionCookieOptions,
		maxAge: 60 * 10,
	});

	const url = new URL('https://id.vk.com/authorize');

	const codeChallenge = await createS256CodeChallenge(codeVerifier);

	url.searchParams.set('response_type', 'code');

	url.searchParams.set('client_id', process.env.AUTH_VK_ID!);

	url.searchParams.set('scope', scopes.join(' '));

	url.searchParams.set('redirect_uri', redirectUrl.href);

	url.searchParams.set('state', state);

	url.searchParams.set('code_challenge', codeChallenge);

	url.searchParams.set('code_challenge_method', 'S256');

	return redirect(url.href);
}
