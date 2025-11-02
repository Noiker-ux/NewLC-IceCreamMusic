'use server';
import { TActionResult } from '@/components/Account/actionGetPersonalData';
import { TVerificationFormSchema } from 'shared/schema/verification.schema';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { cookies } from 'next/headers';
import { functional } from 'sdk';
import { TRegisterVerificationTicketResponse } from 'sdk/lib/verification/verification.controller';
import { TrueOmit } from 'shared/types/omit';

export async function actionPostVerify(
	data: TrueOmit<TVerificationFormSchema, 'contract'> & { contract: string },
): Promise<TActionResult<TRegisterVerificationTicketResponse['data']>> {
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

	const result = await functional.api.v1.verification
		.registerVerifiactionTicket(connection, {
			data: {
				...data,
				birthDate: new Date(data.birthDate).toISOString(),
				getDate: new Date(data.getDate).toISOString(),
			},
		})
		.then((r) => ({ success: true as const, data: r.data }))
		.catch((e) => {
			return {
				success: false as const,
				error: `${e.message}`,
			};
		});

	return result;
}
