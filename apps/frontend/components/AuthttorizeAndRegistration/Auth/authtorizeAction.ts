'use server';
import { TSignInClientSchema } from 'shared/schema/signin.schema';
import { functional } from 'sdk';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const connection = createSDKConnection({});

export async function actionAuthtorize(data: TSignInClientSchema) {
	const signInResult = await functional.v1.auth.signin
		.credentialsSignIn(connection, {
			email: data.email,
			password: data.password,
		})
		.then((e) => {
			return {
				success: true as const,
				token: e.session_token,
			};
		})
		.catch((e) => {
			return {
				success: false as const,
				error: e.message,
			};
		});

	if (!signInResult.success) {
		return signInResult;
	}
	const cookieStore = await cookies();
	if (data.rememberMe) {
		cookieStore.set('icecream-auth', signInResult.token, {
			maxAge: 2592000,
		});
	} else {
		cookieStore.set('icecream-auth', signInResult.token, {
			maxAge: 60 * 60 * 24,
		});
	}
	redirect('/dashboard/main/news/');
}
