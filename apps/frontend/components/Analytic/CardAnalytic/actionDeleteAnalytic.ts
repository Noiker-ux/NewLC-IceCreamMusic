'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { revalidateTag } from 'next/cache';

export async function actionDeleteAnalytic({
	analyticsId,
}: {
	analyticsId: string;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false as const,
			message: 'Вы не авторизованы',
		};
	}

	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		headers,
	});

	functional.api.v1.analytics.deleteAnalytics(connection, analyticsId);

	revalidateTag('admin-analytic');

	return {
		success: true as const,
		message: 'Аналитика успешно удалена',
	};
}
