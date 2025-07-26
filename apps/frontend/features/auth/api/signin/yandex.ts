'use server';
import { generateCodeVerifier, generateState } from 'arctic';
import { createS256CodeChallenge } from 'arctic/dist/oauth2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function yandexSignIn(callbackUrl: string) {
	const state = generateState();

	const codeVerifier = await generateCodeVerifier();

	const redirectUrl = new URL(
		'/api/auth/signin/callback/yandex',
		process.env.NEXT_PUBLIC_DOMAIN!,
	);

	console.log(redirectUrl.href);

	const cookiesStore = await cookies();

	cookiesStore.set('icecream-yandex-state', state, {
		secure: true,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10,
	});

	cookiesStore.set('icecream-yandex-verifier', codeVerifier, {
		secure: true,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10,
	});

	cookiesStore.set('icecream-callback', callbackUrl, {
		secure: true,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10,
	});

	const url = new URL('https://oauth.yandex.ru/authorize');

	const codeChallenge = await createS256CodeChallenge(codeVerifier);

	url.searchParams.set('response_type', 'code');

	url.searchParams.set('client_id', process.env.AUTH_YANDEX_ID!);

	url.searchParams.set('redirect_uri', redirectUrl.href);

	url.searchParams.set('state', state);

	url.searchParams.set('code_challenge', codeChallenge);

	url.searchParams.set('code_challenge_method', 'S256');

	return redirect(url.href);
}
