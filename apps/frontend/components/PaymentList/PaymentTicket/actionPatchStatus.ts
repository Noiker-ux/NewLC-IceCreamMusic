'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional, Primitive } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TGetPayoutTicketsResponse } from 'sdk/lib/finance/finance.controller';

export async function actionPatchStatus({
	ticketId,
	status,
}: {
	ticketId: string;
	status: boolean;
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

	const responce =
		await functional.api.v1.finance.payouts.status.updatePayoutTicketStatus(
			connection,
			ticketId,
			{
				data: {
					confirmed: status,
				},
			},
		);

	if (!responce) {
		return {
			success: false as const,
			message: 'Ошибка при формировании тикета',
		};
	}

	return {
		success: true as const,
		message: 'Тикет успешно подтвержден',
	};
}
