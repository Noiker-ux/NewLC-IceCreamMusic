'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TPayoutTicketData } from 'sdk/lib/finance/finance.controller';

export async function actionPostPayout(data: TPayoutTicketData) {
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

	functional.v1.finance.payouts.createPayoutTicket(connection, {
		data: {
			accountNumber: data.accountNumber,
			amount: Number(data.amount),
			recieverName: data.recieverName,
		},
	});

	return {
		success: true as const,
		message: 'Заявка на вывод средств успешно отправлена',
	};
}
