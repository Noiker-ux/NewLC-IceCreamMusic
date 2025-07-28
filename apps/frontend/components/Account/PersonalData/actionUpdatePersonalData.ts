'use server';

import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { functional } from 'sdk';
import { actionGetPersonalData } from '../actionGetPersonalData';

export async function actionUpdatePersonalData(data: any) {
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
	const PersonalDataMe = await PersonalData.getMyInfo(connection);

	return PersonalData.updateMyInfo(connection, {
		data: {
			...PersonalDataMe,
			avatar: data.avatar
				? `${process.env.NEXT_PUBLIC_S3_URL}/avatars/${PersonalDataMe.data.id}.${data.avatar.name.split('.')[data.avatar.name.split('.').length - 1]}`
				: PersonalDataMe.data.avatar,
			name: `${data.firstName} ${data.secondName}`,
			email: data.email,
		},
	});
}
