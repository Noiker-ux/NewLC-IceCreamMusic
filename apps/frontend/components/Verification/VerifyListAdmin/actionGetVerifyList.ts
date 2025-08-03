'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';

export async function actionGetVerifyList(
	status: 'moderating' | 'approved' | 'rejected',
) {
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

	const result = await functional.v1.verification
		.getVerificationTickets(connection, status, {
			size: 10,
			page: 1,
		})
		.catch((error) => {
			return {
				success: false as const,
				message: error.message,
			};
		});

	return {
		success: true as const,
		data: result,
	};
}
