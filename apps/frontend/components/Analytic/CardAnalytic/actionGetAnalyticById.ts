'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TPayoutTicketData } from 'sdk/lib/finance/finance.controller';
import { revalidateTag } from 'next/cache';
import { TCreateAnalyticsBody } from 'sdk/lib/analytics/analytics.controller';

export async function actionGetAnalyticById({
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

	const responce = await functional.v1.analytics.getAnalyticsById(
		connection,
		analyticsId,
	);

	return {
		success: true as const,
		data: responce,
	};
}
