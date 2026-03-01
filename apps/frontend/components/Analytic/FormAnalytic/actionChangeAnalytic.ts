'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { revalidateTag } from 'next/cache';
import {
	TCreateAnalyticsBody,
	TUpdateAnalyticsBody,
} from 'sdk/lib/analytics/analytics.controller';

export async function actionChangeAnalytic({
	analyticsId,
	data,
}: {
	analyticsId: string;
	data: TUpdateAnalyticsBody;
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

	await functional.api.v1.analytics.updateAnalytics(connection, analyticsId, {
		data: {
			periodStart: data.data.periodStart?.toISOString(),
			periodFinish: data.data.periodFinish?.toISOString(),
			flourishReportMarkup: data.data.flourishReportMarkup,
		},
	});

	await revalidateTag('admin-analytic');

	return {
		success: true as const,
		message: 'Аналитика успешно обнавлена',
	};
}
