'use server';

import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { TGetMeResponse } from 'sdk/lib/user/user.controller';

export type TActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

export async function actionGetPersonalData(): Promise<
	TActionResult<TGetMeResponse['data']>
> {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false as const,
			error: 'Пользователь не авторизован',
		};
	}
	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		next: { tags: ['PersonalData'], revalidate: 10 },
		headers,
	});
	const PersonalData = await functional.api.v1.users.me.getMyInfo(connection);

	const birthDate = PersonalData.data.birthDate
		? new Date(PersonalData.data.birthDate)
		: null;

	const emailVerified = PersonalData.data.emailVerified
		? new Date(PersonalData.data.emailVerified)
		: null;

	return {
		success: true as const,
		data: { ...PersonalData.data, birthDate, emailVerified },
	};
}
