'use server';
import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional, Primitive } from 'sdk';
import { TVerification } from 'sdk/lib/verification/verification.controller';

export async function actionGetVerifyList(
	status: 'moderating' | 'approved' | 'rejected',
): Promise<TActionResult<Primitive<TVerification[]>>> {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false as const,
			error: 'Вы не авторизованы',
		};
	}

	const headers = new Headers();
	headers.set('Authorization', token);
	const connection = createSDKConnection({
		headers,
	});

	const result = await functional.v1.verification
		.getVerificationTickets(connection, status, {
			size: 1000,
			page: 1,
		})
		.then((r) => ({
			success: true as const,
			data: r,
		}))
		.catch((error) => {
			return {
				success: false as const,
				error: error.message,
			};
		});

	if (!result.success) {
		return result;
	}

	return {
		success: true as const,
		data: result.data,
	};
}
