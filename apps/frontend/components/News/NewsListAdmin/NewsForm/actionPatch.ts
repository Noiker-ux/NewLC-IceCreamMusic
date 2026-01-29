'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TUpdateNews, TUpdateNewsResponse } from 'sdk/lib/news/news.controller';
import { TActionResult } from '@/components/Account/actionGetPersonalData';

export async function actionPatch(
	id: string,
	data: TUpdateNews,
): Promise<TActionResult<TUpdateNewsResponse>> {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false as const,
			error: 'Вы не авторизованы',
		};
	}

	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		headers,
	});

	const updateResult = await functional.api.v1.news
		.updateNews(connection, id, {
			data,
		})
		.then((res) => ({
			success: true as const,
			data: res,
		}))
		.catch((error) => {
			return {
				success: false as const,
				error: error.message,
			};
		});

	return updateResult;
}
