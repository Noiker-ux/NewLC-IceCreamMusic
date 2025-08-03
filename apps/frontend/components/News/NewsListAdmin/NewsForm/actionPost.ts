'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TCreateNews } from 'sdk/lib/news/news.controller';

export async function actionPost(data: TCreateNews) {
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

	functional.v1.news
		.createNews(connection, {
			data: {
				title: data.title,
				content: data.content,
				preview: data.preview,
			},
		})
		.catch((error) => {
			return {
				success: false as const,
				message: error.message,
			};
		});

	return {
		success: true as const,
		message: 'Новость успешно добавлена',
	};
}
