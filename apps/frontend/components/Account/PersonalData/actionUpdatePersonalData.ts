'use server';

import { TProfileFormSchema } from 'shared/schema/profile.schema';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { TActionResult } from '../actionGetPersonalData';
import { TUpdateMeResponse } from 'sdk/lib/user/user.controller';

export async function actionUpdatePersonalData(
	data: Partial<Omit<TProfileFormSchema, 'avatar'> & { avatar: string }>,
):Promise<TActionResult<TUpdateMeResponse>> {
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
		headers,
	});

	const response = await functional.v1.users.me.updateMyInfo(connection, {
		data,
	});

	return {
		success: true as const,
		data: response,
	};
}
