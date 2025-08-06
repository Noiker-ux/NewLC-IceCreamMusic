'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional, Primitive } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TActionResult } from '../Account/actionGetPersonalData';
import { TGetPayoutTicketsResponse } from 'sdk/lib/finance/finance.controller';

export async function actionGetPayouts(): Promise<
	TActionResult<Primitive<TGetPayoutTicketsResponse>>
> {
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

	const responce = await functional.v1.finance.payouts
		.getPayoutTickets(connection, {
			page: 1,
			size: 1000,
		})
		.catch(() => {
			return null;
		});

	if (!responce) {
		return {
			success: false as const,
			error: 'Ошибка при получении данных',
		};
	}

	return {
		success: true as const,
		data: responce,
	};
}
