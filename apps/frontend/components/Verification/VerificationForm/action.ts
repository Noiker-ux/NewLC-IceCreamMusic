'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { TVerification } from 'sdk/lib/verification/verification.controller';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { _success } from 'zod/v4/core';

export async function action(data: TVerification) {
	const cookieStore = await cookies();
	const token = cookieStore.get(sessionCookieName)?.value;
	if (!token) {
		return {
			success: false,
		};
	}

	const headers = new Headers();
	headers.set('Authorization', `${token}`);
	const connection = createSDKConnection({
		headers,
	});

	functional.v1.verification
		.registerVerifiactionTicket(connection, {
			data: {
				...data,
				birthDate: new Date(data.birthDate).toISOString(),
				getDate: new Date(data.getDate).toISOString(),
			},
		})
		.catch((e) => {
			return {
				success: false,
				error: e.message,
			};
		});
}
