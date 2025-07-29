'use server';

import { TProfileFormSchema } from '@/schema/profile.schema';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';

export async function actionUpdatePersonalData(data: Partial<Omit<TProfileFormSchema, 'avatar'> & { avatar: string }>) {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false,
			error: 'Пользователь не авторизован',
		};
	}
	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		next: { tags: ['PersonalData'] },
		headers,
	});
	const PersonalData = await functional.v1.users.me;

	return PersonalData.updateMyInfo(connection, {
		data,
	});
}
