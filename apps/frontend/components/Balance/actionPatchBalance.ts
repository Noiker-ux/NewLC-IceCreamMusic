'use server';
import { createSDKConnection } from '@/shared/lib/config/sdk';
import { functional } from 'sdk';
import { cookies } from 'next/headers';
import { sessionCookieName } from '@/shared/lib/config/auth';
import { TPayoutTicketData } from 'sdk/lib/finance/finance.controller';
import { revalidateTag } from 'next/cache';

export async function actionPatchBalance({
	userId,
	balance,
}: {
	userId: string;
	balance: number;
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

	functional.api.v1.users.balance.updateBalance(connection, userId, {
		data: {
			balance: balance,
		},
	});

	revalidateTag('admin-users');

	return {
		success: true as const,
		message: 'Сумма начисленна',
	};
}
